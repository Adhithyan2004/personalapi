import { PrismaClient, ApplicationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1️⃣ Create User
  const user = await prisma.user.create({
    data: {
      name: "Adhi",
      email: "adhi@test.com",
      passwordHash: "hashedpassword"
    }
  });

  console.log("User created:", user.id);

  // 2️⃣ Create Application
  const application = await prisma.application.create({
    data: {
      userId: user.id,
      companyName: "Google",
      role: "Backend Engineer",
      currentStatus: ApplicationStatus.APPLIED,
      appliedDate: new Date()
    }
  });

  console.log("Application created:", application.id);

  // 3️⃣ Create Initial Status History
  await prisma.applicationStatusHistory.create({
    data: {
      applicationId: application.id,
      status: ApplicationStatus.APPLIED,
      note: "Initial application submitted"
    }
  });

  console.log("Status history created.");

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
