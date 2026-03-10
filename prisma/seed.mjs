import {
  PrismaClient,
  Role,
  CasePriority,
  CaseStatus,
  CaseType,
  CaseVisibility,
  CommentType
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin123";

  const advisorEmail =
    process.env.SEED_ADVISOR_EMAIL || "jefe.carrera@example.com";
  const advisorPassword =
    process.env.SEED_ADVISOR_PASSWORD || "advisor123";

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const advisorPasswordHash = await bcrypt.hash(advisorPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin General",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      isActive: true
    }
  });

  const advisor = await prisma.user.upsert({
    where: { email: advisorEmail },
    update: {},
    create: {
      name: "Jefe de Carrera",
      email: advisorEmail,
      passwordHash: advisorPasswordHash,
      role: Role.USER,
      isActive: true
    }
  });

  const student1 = await prisma.student.create({
    data: {
      fullName: "María Pérez",
      email: "maria.perez@universidad.cl",
      studentCode: "20201234",
      career: "Ingeniería",
      notes: "Estudiante con buena disposición."
    }
  });

  const student2 = await prisma.student.create({
    data: {
      fullName: "Juan Soto",
      email: "juan.soto@universidad.cl",
      studentCode: "20204321",
      career: "Trabajo Social"
    }
  });

  const case1 = await prisma.case.create({
    data: {
      studentId: student1.id,
      title: "Dificultades en curso de Cálculo",
      description:
        "La estudiante reporta dificultades para seguir el curso de Cálculo I.",
      caseType: CaseType.ACADEMIC,
      priority: CasePriority.MEDIUM,
      status: CaseStatus.IN_REVIEW,
      nextAction: "Reunión de seguimiento con profesora de Cálculo.",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      visibility: CaseVisibility.TEAM,
      createdById: admin.id,
      assignedToId: advisor.id,
      openedAt: new Date()
    }
  });

  const case2 = await prisma.case.create({
    data: {
      studentId: student2.id,
      title: "Reintegración después de suspensión",
      description: "Estudiante solicita orientación para reintegro al programa.",
      caseType: CaseType.REINTEGRATION,
      priority: CasePriority.HIGH,
      status: CaseStatus.NEW,
      visibility: CaseVisibility.PRIVATE,
      createdById: advisor.id,
      assignedToId: advisor.id,
      openedAt: new Date()
    }
  });

  await prisma.caseComment.createMany({
    data: [
      {
        caseId: case1.id,
        authorId: advisor.id,
        content: "Se agenda reunión con la estudiante para el jueves.",
        commentType: CommentType.CONTACT
      },
      {
        caseId: case1.id,
        authorId: admin.id,
        content:
          "Se sugiere derivar a tutoría académica si persisten dificultades.",
        commentType: CommentType.REFERRAL
      },
      {
        caseId: case2.id,
        authorId: advisor.id,
        content:
          "Se revisan antecedentes de suspensión y requisitos de reintegro.",
        commentType: CommentType.NOTE
      }
    ]
  });

  // eslint-disable-next-line no-console
  console.log(
    `Usuario ADMIN: ${adminEmail} / ${adminPassword} · USER: ${advisorEmail} / ${advisorPassword}`
  );
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
