import prisma from "../../prismaClient";

type AddTeamInput = {
  name: string;
}

type AddTeamArgs = {
  input: AddTeamInput;
}

type AddTeamMemberInput = {
  email: string;
  teamId: number;
}

type AddTeamMemberArgs = {
  input: AddTeamMemberInput;
}

type AddCardInput = {
  title: string;
  assigneeId: number;
  dueDateTime: string;
  teamId: number;
  description?: string;
}

type AddCardArgs = {
  input: AddCardInput;
}

type UpdateCardArgs = {
  id: string;
  input: Partial<AddCardInput>;
}

export const Mutation = {
  addTeam: async (_: any, args: AddTeamArgs, context: Context) => {
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
  },
  addTeamMember: async (_: unknown, args: AddTeamMemberArgs, context: Context) => {
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
  addCard: async (_: unknown, args: AddCardArgs) => {
    try {
      const card = await prisma.card.create({
        data: {
          title: args.input.title,
          assigneeId: args.input.assigneeId,
          dueDateTime: new Date(args.input.dueDateTime),
          teamId: args.input.teamId,
          description: args.input.description ?? "",
        }
      });
      return card.id;
    } catch (error) {
      console.log(error)
      throw new Error('something went wrong')
    }
  },
  // updateCard: async (_: unknown, args: UpdateCardArgs, context: Context) => {
  //   const id = await prisma.card.update({
  //     where: {
  //       id: args.id,
  //     },
  //     data: { ...args.input },
  //   });
  //   // TODO: add history
  // }
};
