import { listStudents } from "@/server/students/students.service";
import Link from "next/link";

export default async function StudentsPage({
  searchParams
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q ?? "";
  const students = await listStudents(query);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Estudiantes</h1>
        <Link
          href="/students/new"
          className="rounded bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          Nuevo estudiante
        </Link>
      </div>
      <form className="max-w-md">
        <input
          type="text"
          name="q"
          placeholder="Buscar por nombre o código"
          defaultValue={query}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </form>
      <div className="overflow-hidden rounded border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Carrera</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-2">
                  <Link
                    href={`/students/${student.id}`}
                    className="text-sky-700 hover:underline"
                  >
                    {student.fullName}
                  </Link>
                </td>
                <td className="px-4 py-2">{student.studentCode}</td>
                <td className="px-4 py-2">{student.career ?? "-"}</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td
                  className="px-4 py-4 text-center text-sm text-slate-500"
                  colSpan={3}
                >
                  No se encontraron estudiantes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

