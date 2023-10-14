import { Team as TeamType } from "@prisma/client";
import prisma from "../../prismaClient";

export const Team = {
  cards: (parent: TeamType) => prisma.card.findMany({
    where: {
      teamId: parent.id,
    }
  }),
};