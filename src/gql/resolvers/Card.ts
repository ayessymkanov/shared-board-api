import prisma from "../../prismaClient";
import { CardResolvers } from "../types";

export const Card: CardResolvers = {
  // @ts-ignore
  assignee: (parent) => prisma.user.findUnique({
    where: {
      id: parent.assigneeId,
    },
  }),
  // @ts-ignore
  team: (parent) => prisma.team.findUnique({
    where: {
      id: parent.teamId,
    },
  }),
};
