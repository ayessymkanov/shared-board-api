import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const card1 = await prisma.card.create({
    data: {
      title: 'Call insurance',
      assigneeId: 1,
      teamId: 1,
      status: 'Open',
      dueDateTime: new Date(),
    }
  });
  console.log({ card1 });
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