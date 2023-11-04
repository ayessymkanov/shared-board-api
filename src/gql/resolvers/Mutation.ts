import prisma from "../../prismaClient";
import { sendEmail } from "../../utils/email";
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
    const [team, user, pendingInvitation] = await Promise.all([
      prisma.team.findUnique({
        where: {
          id: args.input.teamId,
        },
      }),
      prisma.user.findFirst({
        where: {
          email: args.input.email,
        },
      }),
      prisma.pendingMember.findFirst({
        where: {
          email: args.input.email,
          teamId: args.input.teamId,
        },
      }),
    ]);

    if (team?.adminId !== context.user?.id) {
      throw new Error('Not an admin');
    }

    if (!user) {
      if (!pendingInvitation) {
        await prisma.pendingMember.create({
          data: {
            email: args.input.email,
            teamId: args.input.teamId,
          }
        });

        const inviteLink = `${process.env.CLIENT_ORIGIN}/join`;
        sendEmail({
          name: "invite",
          to: args.input.email,
          subject: `${context.user.name} has invited you to join their team at SharedBoard`,
          templateArgs: { name: context.user.name, link: inviteLink },
        });

        return `User is not registered with us yet.
        We sent an email with the invitation to join. 
        Once they sign up, user will be added to your team.`
      } else {
        throw new Error(`${args.input.email} has already received your invitation`);
      }
    }

    const userTeam = await prisma.userTeam.findFirst({
      where: {
        team_id: team?.id,
        user_id: user.id,
      },
    });

    if (userTeam) {
      throw new Error('Already a member of the team');
    }

    await prisma.userTeam.create({
      data: {
        team_id: args.input.teamId,
        user_id: user.id,
      },
    });
    return 'Successfully added user to the team';
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
          title: args.input?.title,
          description: args.input?.description,
          status: args.input?.status,
          assigneeId: args.input?.assigneeId,
          dueDateTime: args.input?.dueDateTime,
        }
      });

      return card.id;
    } catch (err) {
      console.log(err);
      throw new Error('something went wrong');
    }
  }

};
