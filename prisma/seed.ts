import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: "admin",
    },
  });
  const attendee = await prisma.attendee.upsert({
    where: { username: "attendee" },
    update: {},
    create: {
      username: "attendee",
      name: "Atharv",
      password: "attendee",
    },
  });

  const operator = await prisma.operator.upsert({
    where: { username: "operator" },
    update: {},
    create: {
      username: "operator",
      name: "Atharv",
      password: "operator",
    },
  });

  console.log({ admin, attendee, operator });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
