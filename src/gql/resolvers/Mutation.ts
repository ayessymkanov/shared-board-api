import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import prisma from "../../prismaClient";

type AddTeamInput = {
  name: string;
}

type AddTeamArgs = {
  input: AddTeamInput;
}

type SignupInput = {
  name: string;
  email: string;
  password: string;
}

type SignupArgs = {
  input: SignupInput;
}

type LoginInput = {
  email: string;
  password: string;
}

type LoginArgs = {
  input: LoginInput;
}

type AddTeamMemberInput = {
  userId: number;
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
}

type AddCardArgs = {
  input: AddCardInput;
}

export const Mutation = {
  signup: async (_: any, args: SignupArgs) => {
    const { email, name, password } = args.input;
    const user = await prisma.user.findFirst({
      where: {
        email,
      }
    });
    if (user?.id) {
      throw new Error('User with that email already exists');
    }
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: await bcrypt.hash(password, 10),
      }
    });

    return jsonwebtoken.sign(
      { id: newUser?.id, email: newUser?.email, name: newUser.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '1y' },
    );
  },
  login: async (_: any, args: LoginArgs) => {
    const user = await prisma.user.findFirst({
      where: {
        email: args.input.email,
      }
    });

    if (!user) {
      throw new Error('No user with that email found');
    }
    const validCreds = await bcrypt.compare(args.input.password, user.passwordHash);
    if (!validCreds) {
      throw new Error('Not valid credentials');
    }

    return jsonwebtoken.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '1y' }
    );
  },
  addTeam: async (_: any, args: AddTeamArgs, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }

    const team = await prisma.team.create({
      data: {
        name: args.input.name,
        adminId: context.user.id,
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
    if (!context.user) {
      throw new Error('Unauthorized');
    }

    const team = await prisma.team.findUnique({
      where: {
        id: args.input.teamId,
      },
    });

    if (team?.adminId !== context.user.id) {
      throw new Error('Not an admin');
    }

    await prisma.userTeam.create({
      data: {
        team_id: args.input.teamId,
        user_id: args.input.userId,
      },
    });
    return 'added';
  },
  addCard: async (_: unknown, args: AddCardArgs, context: Context) => {
    if (!context.user) {
      throw new Error('Unauthorized');
    }
    try {
      const card = await prisma.card.create({
        data: {
          title: args.input.title,
          assigneeId: args.input.assigneeId,
          dueDateTime: new Date(args.input.dueDateTime),
          teamId: args.input.teamId,
        }
      });
      return card.id;
    } catch (error) {
      console.log(error)
      throw new Error('something went wrong')
    }
  },
};
