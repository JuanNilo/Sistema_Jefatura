import { getCaseById } from "@/server/cases/cases.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth/auth-config";
import { redirect } from "next/navigation";
import { CaseStatus, CasePriority } from "@prisma/client";

async function addCommentAction(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const caseId = formData.get("caseId");
  const content = formData.get("content");

  if (!caseId || typeof caseId !== "string") {
    redirect("/cases");
  }

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    redirect(`/cases/${caseId}`);
  }

  // For the MVP we keep it simple and do not update other fields here yet.
  const { addCommentAndUpdateCase } = await import(
    "@/server/cases/cases.service"
  );

  await addCommentAndUpdateCase({
    caseId,
    content,
    authorId: session.user.id
  });

  redirect(`/cases/${caseId}`);
}

export default async function CaseDetailPage({
  params
}: {
  params: { id: string };
}) {
  const caseRecord = await getCaseById(params.id);

  if (!caseRecord) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Caso no encontrado</h1>
        <p className="mt-2 text-sm text-slate-500">
          Verifica la dirección o vuelve al listado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{caseRecord.title}</h1>
          <p className="text-sm text-slate-500">
            Estudiante: {caseRecord.student.fullName}
          </p>
          <p className="text-sm text-slate-500">
            Responsable: {caseRecord.responsible.name}
          </p>
        </div>
        <div className="space-y-1 text-sm text-right">
          <p>
            Estado:{" "}
            <span className="font-medium">{translateStatus(caseRecord.status)}</span>
          </p>
          <p>
            Prioridad:{" "}
            <span className="font-medium">
              {translatePriority(caseRecord.priority)}
            </span>
          </p>
          <p className="text-xs text-slate-500">
            Última actualización:{" "}
            {caseRecord.updatedAt.toLocaleString("es-CL")}
          </p>
        </div>
      </header>
      <section className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Comentarios</h2>
          <div className="space-y-3 rounded border border-slate-200 bg-white p-4 text-sm">
            {caseRecord.comments.length === 0 && (
              <p className="text-slate-500">
                Aún no hay comentarios en este caso.
              </p>
            )}
            {caseRecord.comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-slate-100 pb-2 last:border-b-0 last:pb-0"
              >
                <p>{comment.content}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {comment.author.name} ·{" "}
                  {comment.createdAt.toLocaleString("es-CL")}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Nuevo comentario</h2>
          <form action={addCommentAction} className="space-y-3">
            <input type="hidden" name="caseId" value={caseRecord.id} />
            <textarea
              name="content"
              rows={4}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              required
            />
            <button
              type="submit"
              className="w-full rounded bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              Agregar comentario
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function translateStatus(status: CaseStatus): string {
  switch (status) {
    case CaseStatus.OPEN:
      return "Abierto";
    case CaseStatus.IN_PROGRESS:
      return "En progreso";
    case CaseStatus.WAITING_STUDENT:
      return "Esperando estudiante";
    case CaseStatus.CLOSED:
      return "Cerrado";
    default:
      return status;
  }
}

function translatePriority(priority: CasePriority): string {
  switch (priority) {
    case CasePriority.LOW:
      return "Baja";
    case CasePriority.MEDIUM:
      return "Media";
    case CasePriority.HIGH:
      return "Alta";
    case CasePriority.URGENT:
      return "Urgente";
    default:
      return priority;
  }
}

