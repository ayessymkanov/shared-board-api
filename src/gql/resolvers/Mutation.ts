import prisma from "../../prismaClient";
import { MutationResolvers } from "../types";

export const Mutation: MutationResolvers = {
  addTeam: async (_, args, context) => {
    try {
      const team = await prisma.team.create({
        data: {
          name: args.input.name,
          adminId: context.user?.id ?? 0,
        }
      });

      await prisma.userTeam.create({
        data: {
          team_id: team.id,
          user_id: team.adminId,
        }
      });

      return team;
    } catch (err) {
      console.log(err);
      throw new Error("something went wrong");
    }
  },
  addTeamMember: async (_, args, context) => {
    const [team, user] = await Promise.all([
      prisma.team.findUnique({
        where: {
          id: args.input.teamId,
        },
      }),
      prisma.user.findFirst({
        where: {
          email: args.input.email,
        }
      })
    ]);

    if (team?.adminId !== context.user?.id) {
      throw new Error('Not an admin');
    }

    if (!user) {
      throw new Error(`No user found with email ${args.input.email}`);
    }

    await prisma.userTeam.create({
      data: {
        team_id: args.input.teamId,
        user_id: user.id,
      },
    });
    return 'added';
  },
  addCard: async (_, args) => {
    try {
      const card = await prisma.card.create({
        data: {
          title: args.input.title,
          assigneeId: args.input.assigneeId,
          dueDateTime: new Date(args.input.dueDateTime),
          teamId: args.input.teamId,
          description: args.input.description ?? "",
          status: 'Open',
        }
      });
      return card.id;
    } catch (error) {
      console.log(error)
      throw new Error('something went wrong')
    }
  },
  updateCard: async (_, args) => {
    try {
      const card = await prisma.card.update({
        where: {
          id: args.id,
        },
        data: {
          ...args.input,
        },
      });

      return card.id;
    } catch (err) {
      console.log(err);
      throw new Error('something went wrong');
    }
  }

};
