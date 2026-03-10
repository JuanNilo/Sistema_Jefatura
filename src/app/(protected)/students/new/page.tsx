import { createStudent } from "@/server/students/students.service";
import { createStudentSchema } from "@/lib/validation/student";
import { redirect } from "next/navigation";

async function createStudentAction(formData: FormData) {
  "use server";

  const result = createStudentSchema.safeParse({
    fullName: formData.get("fullName"),
    studentCode: formData.get("studentCode"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    career: formData.get("career")
  });

  if (!result.success) {
    // For simplicity in the MVP we just redirect back; in a real app you would show validation errors.
    redirect("/students/new");
  }

  await createStudent(result.data);
  redirect("/students");
}

export default function NewStudentPage() {
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Nuevo estudiante</h1>
      <form action={createStudentAction} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="fullName">
            Nombre completo
          </label>
          <input
            id="fullName"
            name="fullName"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            required
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="studentCode"
          >
            Código estudiante
          </label>
          <input
            id="studentCode"
            name="studentCode"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="phone">
              Teléfono
            </label>
            <input
              id="phone"
              name="phone"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="career">
            Carrera
          </label>
          <input
            id="career"
            name="career"
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

