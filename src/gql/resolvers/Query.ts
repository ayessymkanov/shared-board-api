import { addDays } from "date-fns";
import prisma from "../../prismaClient";
import { convertToDate } from "../../utils";

type ArgsType = {
  id: number;
}

type CardArgsType = {
  id: string;
}

type CardsArgs = {
  input: CardsFilterInput;
}

type CardsFilterInput = {
  timestamp?: number;
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
        NOT: {
          id: context.user.personalBoardId,
        }
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
  team: async (_: unknown, args: ArgsType, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }

    const userTeam = await prisma.userTeam.findFirst({
      where: {
        user_id: context.user.id,
        team_id: args.id,
      }
    });

    if (!userTeam) {
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
  cards: (_: unknown, args: CardsArgs, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }
    let minDate = new Date("1/1/1970");
    let maxDate = new Date("1/1/2070");

    if (args?.input?.timestamp) {
      const timestampNum = Number(args.input.timestamp);
      minDate = new Date(timestampNum);
      maxDate = addDays(new Date(timestampNum), 1);
    }

    return prisma.card.findMany({
      where: {
        assigneeId: context.user.id,
        dueDateTime: {
          lt: maxDate,
          gte: minDate,
        }
      }
    });
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
  userCards: (_: unknown, args: unknown, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }

    return prisma.card.findMany({
      where: {
        assigneeId: context.user.id,
      },
    });
  },
  today: async (_: unknown, args: unknown, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }
    const cards = await prisma.card.findMany({
      where: {
        assigneeId: context.user.id,
      },
    });
    const now = Date.now();
    const todayDate = convertToDate(now);

    return cards.filter((card) => convertToDate(card.dueDateTime) === todayDate);
  }
};
