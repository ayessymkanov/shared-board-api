import { addDays } from "date-fns";
import prisma from "../../prismaClient";
import { convertToDate } from "../../utils";
import { QueryResolvers } from "../types";

export const Query: QueryResolvers = {
  me: (_, args, context) => {
    return context.user;
  },
  users: () => {
    return prisma.user.findMany();
  },
  user: (_, args) => {
    return prisma.user.findUnique({
      where: {
        id: args.id,
      },
    });
  },
  teams: async (_, args, context: Context) => {
    const userTeamsResponse = await prisma.userTeam.findMany({
      where: {
        user_id: context.user?.id,
        NOT: {
          team_id: context.user?.personalBoardId,
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
  team: async (_, args, context: Context) => {
    const userTeam = await prisma.userTeam.findFirst({
      where: {
        user_id: context.user?.id,
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
  teamMembers: async (_, args, context) => {
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
  cards: (_, args, context) => {
    let minDate = new Date("1/1/1970");
    let maxDate = new Date("1/1/2070");

    if (args?.input?.timestamp) {
      const timestampNum = Number(args.input.timestamp);
      minDate = new Date(timestampNum);
      maxDate = addDays(new Date(timestampNum), 1);
    }

    if (args?.input?.startTimestamp) {
      const timestamp = Number(args.input.startTimestamp);
      minDate = new Date(timestamp);
    }

    if (args?.input?.endTimestamp) {
      const timestamp = Number(args.input.endTimestamp) + 1000;
      maxDate = new Date(timestamp);
    }

    return prisma.card.findMany({
      where: {
        assigneeId: context.user?.id,
        dueDateTime: {
          lt: maxDate,
          gte: minDate,
        }
      }
    });
  },
  card: async (_, args) => {
    return prisma.card.findUnique({
      where: {
        id: args.id,
      },
    });
  },
  userCards: (_, args, context) => {
    return prisma.card.findMany({
      where: {
        assigneeId: context.user?.id,
      },
    });
  },
  today: async (_, args, context) => {
    const cards = await prisma.card.findMany({
      where: {
        assigneeId: context.user?.id,
      },
    });
    const now = Date.now();
    const todayDate = convertToDate(now);

    return cards.filter((card) => convertToDate(card.dueDateTime) === todayDate);
  }
};
