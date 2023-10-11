
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const arman = await prisma.userTeam.create({
    data: {
      user_id: 1,
      team_id: 1
    }
  })
  const azhar = await prisma.userTeam.create({
    data: {
      user_id: 2,
      team_id: 1
    }
  })
  const askar = await prisma.userTeam.create({
    data: {
      user_id: 3,
      team_id: 1
    }
  })
  console.log({ arman, azhar, askar });
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