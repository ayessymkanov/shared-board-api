import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.userTeam.deleteMany();
  await prisma.card.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })