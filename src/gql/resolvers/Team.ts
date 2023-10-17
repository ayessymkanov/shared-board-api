import { Team as TeamType } from "@prisma/client";
import prisma from "../../prismaClient";

export const Team = {
  cards: (parent: TeamType) => prisma.card.findMany({
    where: {
      teamId: parent.id,
    }
  }),
  teamMembers: async (parent: TeamType) => {
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