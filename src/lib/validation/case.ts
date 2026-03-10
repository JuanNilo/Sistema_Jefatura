import { z } from "zod";
import { CasePriority, CaseType, CaseVisibility } from "@prisma/client";

export const createCaseSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  studentId: z.string().min(1, "El estudiante es obligatorio"),
  assignedToId: z.string().min(1, "El responsable es obligatorio"),
  caseType: z.nativeEnum(CaseType),
  priority: z.nativeEnum(CasePriority),
  visibility: z.nativeEnum(CaseVisibility).optional(),
  nextAction: z.string().optional().or(z.literal("")),
  dueDate: z
    .string()
    .datetime()
    .optional()
    .or(z.literal(""))
});

export type CreateCaseInput = z.infer<typeof createCaseSchema>;
