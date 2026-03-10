import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/auth-config";
import { listCases } from "@/server/cases/cases.service";
import { parseCaseFilters } from "@/server/cases/cases.filters";
import Link from "next/link";

export default async function CasesPage({
  searchParams
}: {
  searchParams?: {
    status?: string | string[];
    priority?: string;
    responsibleId?: string;
    studentQuery?: string;
    dueState?: string;
  };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const filters = parseCaseFilters(searchParams ?? {});
  const cases = await listCases(filters, {
    id: session.user.id,
    role: session.user.role
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Casos</h1>
        <Link
          href="/cases/new"
          className="rounded bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          Nuevo caso
        </Link>
      </div>
      <form className="flex flex-wrap gap-2 text-sm">
        <input
          type="text"
          name="studentQuery"
          placeholder="Buscar por estudiante"
          defaultValue={searchParams?.studentQuery ?? ""}
          className="rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
        <select
          name="status"
          defaultValue={searchParams?.status ?? ""}
          className="rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="">Estado (todos)</option>
          <option value="NEW">Nuevo</option>
          <option value="IN_REVIEW">En revisión</option>
          <option value="PENDING_STUDENT">Pendiente estudiante</option>
          <option value="REFERRED">Derivado</option>
          <option value="FOLLOW_UP">Seguimiento</option>
          <option value="RESOLVED">Resuelto</option>
          <option value="CLOSED">Cerrado</option>
        </select>
        <select
          name="priority"
          defaultValue={searchParams?.priority ?? ""}
          className="rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="">Prioridad (todas)</option>
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
          <option value="URGENT">Urgente</option>
        </select>
        <select
          name="dueState"
          defaultValue={searchParams?.dueState ?? ""}
          className="rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="">Compromiso</option>
          <option value="overdue">Vencidos</option>
          <option value="thisWeek">Esta semana</option>
        </select>
        <button
          type="submit"
          className="rounded bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900"
        >
          Filtrar
        </button>
      </form>
      <div className="overflow-hidden rounded border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Estudiante</th>
              <th className="px-4 py-2">Título</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Prioridad</th>
              <th className="px-4 py-2">Responsable</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseRecord) => (
              <tr
                key={caseRecord.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-2">{caseRecord.student.fullName}</td>
                <td className="px-4 py-2">
                  <Link
                    href={`/cases/${caseRecord.id}`}
                    className="text-sky-700 hover:underline"
                  >
                    {caseRecord.title}
                  </Link>
                </td>
                <td className="px-4 py-2">{caseRecord.status}</td>
                <td className="px-4 py-2">{caseRecord.priority}</td>
                <td className="px-4 py-2">
                  {caseRecord.assignedTo?.name ?? "-"}
                </td>
              </tr>
            ))}
            {cases.length === 0 && (
              <tr>
                <td
                  className="px-4 py-4 text-center text-sm text-slate-500"
                  colSpan={5}
                >
                  No se encontraron casos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
