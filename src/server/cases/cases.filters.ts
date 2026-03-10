import type { CasePriority, CaseStatus } from "@prisma/client";

export type CaseFilters = {
  status?: CaseStatus[];
  priority?: CasePriority;
  responsibleId?: string;
  studentQuery?: string;
  dueState?: "overdue" | "thisWeek";
};

export type RawCaseFilters = {
  status?: string | string[];
  priority?: string;
  responsibleId?: string;
  studentQuery?: string;
  dueState?: string;
};

export function parseCaseFilters(raw: RawCaseFilters): CaseFilters {
  const filters: CaseFilters = {};

  if (raw.status) {
    const values = Array.isArray(raw.status) ? raw.status : [raw.status];
    filters.status = values.filter(
      (value): value is CaseStatus =>
        value === "OPEN" ||
        value === "IN_PROGRESS" ||
        value === "WAITING_STUDENT" ||
        value === "CLOSED"
    );
  }

  if (raw.priority) {
    if (
      raw.priority === "LOW" ||
      raw.priority === "MEDIUM" ||
      raw.priority === "HIGH" ||
      raw.priority === "URGENT"
    ) {
      filters.priority = raw.priority;
    }
  }

  if (raw.responsibleId) {
    filters.responsibleId = raw.responsibleId;
  }

  if (raw.studentQuery && raw.studentQuery.trim().length > 0) {
    filters.studentQuery = raw.studentQuery.trim();
  }

  if (raw.dueState === "overdue" || raw.dueState === "thisWeek") {
    filters.dueState = raw.dueState;
  }

  return filters;
}

