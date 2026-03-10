import { prisma } from "@/lib/db";
import type { CreateStudentInput } from "@/lib/validation/student";

export async function createStudent(input: CreateStudentInput) {
  const { fullName, studentCode, email, phone, career } = input;

  return prisma.student.create({
    data: {
      fullName,
      studentCode,
      email: email || null,
      phone: phone || null,
      career: career || null
    }
  });
}

export async function listStudents(query?: string) {
  const where =
    query && query.trim().length > 0
      ? {
          OR: [
            { fullName: { contains: query, mode: "insensitive" } },
            { studentCode: { contains: query, mode: "insensitive" } }
          ]
        }
      : {};

  return prisma.student.findMany({
    where,
    orderBy: { fullName: "asc" }
  });
}

export async function getStudentById(id: string) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      cases: {
        orderBy: { createdAt: "desc" },
        include: {
          responsible: true
        }
      }
    }
  });
}

