import type {
  Case,
  CaseComment,
  CasePriority,
  CaseStatus,
  Student,
  User
} from "@prisma/client";

export type AppCase = Case;
export type AppCaseStatus = CaseStatus;
export type AppCasePriority = CasePriority;
export type AppCaseComment = CaseComment;

export type CaseWithStudentAndAssignee = Case & {
  student: Student;
  assignedTo: User;
};
