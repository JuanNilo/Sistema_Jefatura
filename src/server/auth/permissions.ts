import type { Role } from "@prisma/client";
import type { Case } from "@prisma/client";

export type AuthenticatedUser = {
  id: string;
  role: Role;
};

export function isAdmin(user: AuthenticatedUser): boolean {
  return user.role === "ADMIN";
}

export function canAccessCase(
  user: AuthenticatedUser,
  caseRecord: Pick<Case, "assignedToId" | "createdById">
): boolean {
  if (isAdmin(user)) {
    return true;
  }

  return (
    caseRecord.assignedToId === user.id || caseRecord.createdById === user.id
  );
}
