import prisma from "../../prismaClient";

export const Team = {
  cards: (parent: any, args: any, context: any) => prisma.card.findMany({
    where: {
      teamId: parent.id,
    }
  }),
};