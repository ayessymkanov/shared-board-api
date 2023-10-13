import prisma from "../../prismaClient";

export const Card = {
  assignee: (parent: any, args: any, context: any) => prisma.user.findFirst({
    where: {
      id: parent.assignedId,
    }
  }),
};