import prisma from "../../prismaClient";
import { TeamResolvers } from "../types";

export const Team: TeamResolvers = {
  cards: (parent) => prisma.card.findMany({
    where: {
      teamId: parent.id,
    }
  }),
  teamMembers: async (parent) => {
    const userTeamResponse = await prisma.userTeam.findMany({
      where: {
        team_id: parent.id,
      }
    });

    return prisma.user.findMany({
      where: {
        id: {
          in: userTeamResponse.map(r => r.user_id),
        },
      },
    });
  },
};
