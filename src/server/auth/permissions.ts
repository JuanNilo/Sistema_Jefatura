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
  caseRecord: Pick<Case, "responsibleUserId" | "createdByUserId">
): boolean {
  if (isAdmin(user)) {
    return true;
  }

  return (
    caseRecord.responsibleUserId === user.id ||
    caseRecord.createdByUserId === user.id
  );
}

