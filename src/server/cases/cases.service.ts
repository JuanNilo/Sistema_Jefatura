import { prisma } from "@/lib/db";
import type { CreateCaseInput } from "@/lib/validation/case";
import type { AuthenticatedUser } from "@/server/auth/permissions";
import { isPastOrToday } from "@/lib/date";
import { CasePriority, CaseStatus } from "@prisma/client";
import type { CaseFilters } from "./cases.filters";

export async function createCase(
  input: CreateCaseInput,
  currentUser: AuthenticatedUser
) {
  const { title, description, studentId, responsibleUserId, priority } = input;
  const nextAction = input.nextAction || null;
  const dueDate = input.dueDate ? new Date(input.dueDate) : null;

  return prisma.case.create({
    data: {
      title,
      description,
      studentId,
      responsibleUserId,
      priority,
      nextAction,
      dueDate,
      createdByUserId: currentUser.id
    }
  });
}

export async function addCommentAndUpdateCase(options: {
  caseId: string;
  content: string;
  updates?: {
    status?: CaseStatus;
    priority?: CasePriority;
    responsibleUserId?: string;
    nextAction?: string;
    dueDate?: Date | null;
  };
  authorId: string;
}) {
  const { caseId, content, updates, authorId } = options;

  return prisma.$transaction(async (tx) => {
    const updatedCase = await tx.case.update({
      where: { id: caseId },
      data: {
        status: updates?.status,
        priority: updates?.priority,
        responsibleUserId: updates?.responsibleUserId,
        nextAction: updates?.nextAction,
        dueDate: updates?.dueDate
      }
    });

    await tx.caseComment.create({
      data: {
        caseId,
        authorUserId: authorId,
        content
      }
    });

    return updatedCase;
  });
}

export async function getCaseById(id: string) {
  return prisma.case.findUnique({
    where: { id },
    include: {
      student: true,
      responsible: true,
      createdBy: true,
      comments: {
        include: {
          author: true
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });
}

export async function listCases(
  filters: CaseFilters,
  currentUser: AuthenticatedUser
) {
  const where: Parameters<typeof prisma.case.findMany>[0]["where"] = {};

  if (filters.status && filters.status.length > 0) {
    where.status = { in: filters.status };
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.responsibleId) {
    where.responsibleUserId = filters.responsibleId;
  }

  if (filters.studentQuery) {
    where.student = {
      OR: [
        { fullName: { contains: filters.studentQuery, mode: "insensitive" } },
        { studentCode: { contains: filters.studentQuery, mode: "insensitive" } }
      ]
    };
  }

  if (filters.dueState === "overdue") {
    where.dueDate = {
      lt: new Date()
    };
  }

  if (filters.dueState === "thisWeek") {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    where.dueDate = {
      gte: start,
      lt: end
    };
  }

  if (currentUser.role !== "ADMIN") {
    where.OR = [
      { responsibleUserId: currentUser.id },
      { createdByUserId: currentUser.id }
    ];
  }

  return prisma.case.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      student: true,
      responsible: true
    }
  });
}

export async function listCasesNeedingAttention(
  currentUser: AuthenticatedUser
) {
  const where: Parameters<typeof prisma.case.findMany>[0]["where"] = {
    status: {
      in: [CaseStatus.OPEN, CaseStatus.IN_PROGRESS, CaseStatus.WAITING_STUDENT]
    }
  };

  if (currentUser.role !== "ADMIN") {
    where.OR = [
      { responsibleUserId: currentUser.id },
      { createdByUserId: currentUser.id }
    ];
  }

  const cases = await prisma.case.findMany({
    where,
    include: {
      student: true,
      responsible: true
    }
  });

  return cases.filter((caseRecord) => {
    if (caseRecord.dueDate && isPastOrToday(caseRecord.dueDate)) {
      return true;
    }

    if (!caseRecord.nextAction || caseRecord.nextAction.trim().length === 0) {
      return true;
    }

    return false;
  });
}
