import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/auth-config";

export async function Sidebar() {
  const session = await getServerSession(authOptions);

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <h1 className="text-lg font-semibold">Casos estudiantiles</h1>
        {session?.user && (
          <p className="mt-1 text-xs text-slate-500">
            {session.user.name} ({session.user.role})
          </p>
        )}
      </div>
      <nav className="flex-1 space-y-1 p-4 text-sm">
        <Link
          href="/dashboard"
          className="block rounded px-3 py-2 hover:bg-slate-100"
        >
          Dashboard
        </Link>
        <Link
          href="/cases"
          className="block rounded px-3 py-2 hover:bg-slate-100"
        >
          Casos
        </Link>
        <Link
          href="/students"
          className="block rounded px-3 py-2 hover:bg-slate-100"
        >
          Estudiantes
        </Link>
      </nav>
    </aside>
  );
}

