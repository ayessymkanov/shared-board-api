import prisma from "../../prismaClient";

type ArgsType = {
  id: number;
}

type CardArgsType = {
  id: string;
}

export const Query = {
  me: (_: unknown, args: unknown, context: Context) => context.user,
  users: (_: unknown, args: unknown, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }
    return prisma.user.findMany();
  },
  user: (_: unknown, args: ArgsType) => prisma.user.findUnique({
    where: {
      id: args.id,
    },
  }),
  teams: () => prisma.team.findMany(),
  team: (_: unknown, args: ArgsType) => prisma.team.findUnique({
    where: {
      id: args.id,
    },
  }),
  teamMembers: async (_: unknown, args: ArgsType) => {
    const userTeamsResponse = await prisma.userTeam.findMany({
      where: {
        team_id: args.id, 
      },
    });
    return prisma.user.findMany({
      where: {
        id: {
          in: userTeamsResponse.map(r => r.user_id),
        },
      },
    });
  },
  cards: () => prisma.card.findMany(),
  card: async (_: unknown, args: CardArgsType) => prisma.card.findUnique({
    where: {
      id: args.id,
    },
  }),
};