import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/auth-config";
import { listCasesNeedingAttention } from "@/server/cases/cases.service";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const cases = await listCasesNeedingAttention({
    id: session.user.id,
    role: session.user.role
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <section>
        <h2 className="mb-2 text-lg font-semibold">Requiere atención</h2>
        {cases.length === 0 ? (
          <p className="text-sm text-slate-500">
            No hay casos que requieran atención inmediata.
          </p>
        ) : (
          <ul className="space-y-2">
            {cases.map((caseRecord) => (
              <li
                key={caseRecord.id}
                className="flex items-center justify-between rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">{caseRecord.title}</p>
                  <p className="text-xs text-slate-500">
                    {caseRecord.student.fullName} · Responsable:{" "}
                    {caseRecord.assignedTo.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
