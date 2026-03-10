import { getStudentById } from "@/server/students/students.service";
import Link from "next/link";

export default async function StudentDetailPage({
  params
}: {
  params: { id: string };
}) {
  const student = await getStudentById(params.id);

  if (!student) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Estudiante no encontrado</h1>
        <p className="mt-2 text-sm text-slate-500">
          Verifica la dirección o vuelve al listado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{student.fullName}</h1>
        <p className="text-sm text-slate-500">
          Código: {student.studentCode}
        </p>
        <p className="text-sm text-slate-500">
          Carrera: {student.career ?? "Sin información"}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Casos</h2>
        <Link
          href={`/cases/new?studentId=${student.id}`}
          className="rounded bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          Nuevo caso
        </Link>
      </div>
      <div className="overflow-hidden rounded border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Título</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Prioridad</th>
              <th className="px-4 py-2">Responsable</th>
            </tr>
          </thead>
          <tbody>
            {student.cases.map((caseRecord) => (
              <tr
                key={caseRecord.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
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
                  {caseRecord.responsible?.name ?? "-"}
                </td>
              </tr>
            ))}
            {student.cases.length === 0 && (
              <tr>
                <td
                  className="px-4 py-4 text-center text-sm text-slate-500"
                  colSpan={4}
                >
                  Este estudiante no tiene casos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

