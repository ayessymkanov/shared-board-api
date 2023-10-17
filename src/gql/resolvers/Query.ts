import prisma from "../../prismaClient";

type ArgsType = {
  id: number;
}

type CardArgsType = {
  id: string;
}

export const Query = {
  me: (_: unknown, args: unknown, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }

    return context.user;
  },
  users: (_: unknown, args: unknown, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }
    return prisma.user.findMany();
  },
  user: (_: unknown, args: ArgsType, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }

    return prisma.user.findUnique({
      where: {
        id: args.id,
      },
    });
  },
  teams: async (_: unknown, args: unknown, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }
    const userTeamsResponse = await prisma.userTeam.findMany({
      where: {
        user_id: context.user.id,
      }
    });

    return prisma.team.findMany({
      where: {
        id: {
          in: userTeamsResponse.map(r => r.team_id),
        },
      },
    });
  },
  team: (_: unknown, args: ArgsType, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }

    return prisma.team.findUnique({
      where: {
        id: args.id,
      },
    });
  },
  teamMembers: async (_: unknown, args: ArgsType, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }

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
  cards: (_: unknown, args: unknown, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }

    return prisma.card.findMany();
  },
  card: async (_: unknown, args: CardArgsType, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }

    return prisma.card.findUnique({
      where: {
        id: args.id,
      },
    });
  },
};