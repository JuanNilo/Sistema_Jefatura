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

export type CaseWithStudentAndResponsible = Case & {
  student: Student;
  responsible: User;
};

