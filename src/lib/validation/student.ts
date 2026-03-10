import { z } from "zod";

export const createStudentSchema = z.object({
  fullName: z.string().min(1, "El nombre es obligatorio"),
  studentCode: z.string().min(1, "El código es obligatorio"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  career: z.string().optional().or(z.literal(""))
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

