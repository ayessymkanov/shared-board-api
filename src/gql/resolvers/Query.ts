import prisma from "../../prismaClient";

export const Query = {
  users: () => prisma.user.findMany(),
  user: (_: any, args: { id: number }) => prisma.user.findFirst({
    where: {
      id: args.id,
    },
  }),
  teams: () => prisma.team.findMany(),
  team: (_: any, args: { id: number }) => prisma.team.findFirst({
    where: {
      id: args.id,
    }
  }),
  teamMembers: async (_: any, args: { id: number }) => {
    const userTeamsResponse = await prisma.userTeam.findMany({
      where: {
        team_id: args.id, 
      },
    });
    return prisma.user.findMany({
      where: {
        id: {
          in: userTeamsResponse.map(r => r.user_id),
        }
      }
    })
  },
  cards: () => prisma.card.findMany(),
  card: async (_: any, args: {id: string}, context: any) => prisma.card.findFirst({
    where: {
      id: args.id,
    }
  }),
};