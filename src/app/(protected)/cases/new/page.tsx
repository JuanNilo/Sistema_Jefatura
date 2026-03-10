import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/auth-config";
import { createCaseSchema } from "@/lib/validation/case";
import { createCase } from "@/server/cases/cases.service";
import { prisma } from "@/lib/db";
import { CasePriority, CaseType, CaseVisibility } from "@prisma/client";

async function createCaseAction(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const visibilityValue = formData.get("visibility");
  const normalizedVisibility =
    typeof visibilityValue === "string" && visibilityValue.length > 0
      ? visibilityValue
      : undefined;

  const result = createCaseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    studentId: formData.get("studentId"),
    assignedToId:
      formData.get("assignedToId") ?? session.user.id.toString(),
    caseType: formData.get("caseType"),
    priority: formData.get("priority"),
    visibility: normalizedVisibility,
    nextAction: formData.get("nextAction"),
    dueDate: formData.get("dueDate")
  });

  if (!result.success) {
    redirect("/cases/new");
  }

  await createCase(result.data, {
    id: session.user.id,
    role: session.user.role
  });

  redirect("/cases");
}

export default async function NewCasePage({
  searchParams
}: {
  searchParams?: { studentId?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const students = await prisma.student.findMany({
    orderBy: { fullName: "asc" }
  });
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" }
  });

  const preselectedStudentId = searchParams?.studentId ?? "";

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Nuevo caso</h1>
      <form action={createCaseAction} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="studentId">
            Estudiante
          </label>
          <select
            id="studentId"
            name="studentId"
            defaultValue={preselectedStudentId}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            required
          >
            <option value="">Selecciona un estudiante</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.fullName} ({student.studentCode})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="title">
            Título
          </label>
          <input
            id="title"
            name="title"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            required
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="caseType"
          >
            Tipo de caso
          </label>
          <select
            id="caseType"
            name="caseType"
            defaultValue={CaseType.ACADEMIC}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            required
          >
            <option value={CaseType.ACADEMIC}>Académico</option>
            <option value={CaseType.PERSONAL}>Personal</option>
            <option value={CaseType.ATTENDANCE}>Asistencia</option>
            <option value={CaseType.REINTEGRATION}>Reintegración</option>
            <option value={CaseType.COURSE_LOAD}>Carga académica</option>
            <option value={CaseType.SCHEDULE_CONFLICT}>Choque de horario</option>
            <option value={CaseType.INTERNSHIP}>Práctica / Internado</option>
            <option value={CaseType.BENEFITS}>Beneficios</option>
            <option value={CaseType.COEXISTENCE}>Convivencia</option>
            <option value={CaseType.INSTITUTIONAL_REFERRAL}>
              Derivación institucional
            </option>
            <option value={CaseType.OTHER}>Otro</option>
          </select>
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="description"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="assignedToId"
            >
              Responsable
            </label>
            <select
              id="assignedToId"
              name="assignedToId"
              defaultValue={session.user.id}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              required
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="priority"
            >
              Prioridad
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue={CasePriority.MEDIUM}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              required
            >
              <option value={CasePriority.LOW}>Baja</option>
              <option value={CasePriority.MEDIUM}>Media</option>
              <option value={CasePriority.HIGH}>Alta</option>
              <option value={CasePriority.URGENT}>Urgente</option>
            </select>
          </div>
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="visibility"
          >
            Visibilidad
          </label>
          <select
            id="visibility"
            name="visibility"
            defaultValue=""
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="">Predeterminada</option>
            <option value={CaseVisibility.PRIVATE}>Privado</option>
            <option value={CaseVisibility.TEAM}>Equipo</option>
            <option value={CaseVisibility.INSTITUTION}>Institucional</option>
          </select>
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="nextAction"
          >
            Próxima acción
          </label>
          <input
            id="nextAction"
            name="nextAction"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="dueDate">
            Fecha compromiso
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="datetime-local"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
