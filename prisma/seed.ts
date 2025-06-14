import { PrismaClient } from "./generated/prisma/client";
const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: "admin",
      email: "admin@gmail.com",
    },
  });
  const attendee = await prisma.attendee.upsert({
    where: { username: "attendee" },
    update: {},
    create: {
      username: "attendee",
      password: "attendee",
      email: "attendee@gmail.com",
    },
  });

  const operator = await prisma.operator.upsert({
    where: { username: "operator" },
    update: {},
    create: {
      username: "operator",
      password: "operator",
      email: "operator@gmail.com",
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
