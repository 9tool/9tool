import { prisma } from "../src/server/db";

async function main() {
  const id = "cle09sz8v0000fzu5al302fde";
  await prisma.overlay.upsert({
    where: {
      id,
    },
    create: {
      id,
      name: "Example Overlay",
      key: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    },
    update: {
      key: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    },
  });
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
