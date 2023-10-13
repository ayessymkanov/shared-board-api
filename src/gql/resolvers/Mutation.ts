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

export const Mutation = {
  signup: async (_: any, args: SignupArgs, context: any) => {
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

    const token = jsonwebtoken.sign(
      { id: newUser?.id, email: newUser?.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1y' },
    );

    context.res.cookie("access_token", token, {
      httpOnly: true,
    });
    return token;
  },
  login: async (_: any, args: LoginArgs, context: any) => {
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

    const token =  jsonwebtoken.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1y' }
    );

    context.res.cookie("access_token", token, {
      httpOnly: true,
    });
    return token
  },
  addTeam: (_: any, args: AddTeamArgs) => prisma.team.create({
    data: {
      name: args.input.name
    }
  }),
};