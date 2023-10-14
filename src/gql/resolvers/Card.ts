import { Card as CardType } from "@prisma/client";
import prisma from "../../prismaClient";

export const Card = {
  assignee: (parent: CardType) => prisma.user.findUnique({
    where: {
      id: parent.assigneeId,
    },
  }),
};