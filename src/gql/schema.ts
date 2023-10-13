export const typeDefs = `#graphql
  type User {
    name: String!
    email: String!
    id: ID!
  }

  type Team {
    name: String!
    id: ID!
    cards: [Card!]!
  }

  enum Status {
    Open 
    Done 
    In_progress
  }

  type CardRaw {
    title: String!
    id: ID!
    assigneeId: Int!
    createdAt: String!
    dueDateTime: String!
    teamId: Int!
    status: Status!
  }

  type Card {
    title: String!
    id: ID!
    assigneeId: Int!
    createdAt: String!
    dueDateTime: String!
    teamId: Int!
    status: Status!
    assignee: User!
  }

  type Query {
    me: User!
    users: [User!]!
    user(id: Int!): User
    teams: [Team!]!
    team(id: Int!): Team
    teamMembers(id: Int!): [User!]!
    cards: [CardRaw!]!
    card(id: String!): Card
  }

  type Mutation {
    addTeam(input: AddTeamInput!): Team!
    signup(input: SignupInput): String!
    login(input: LoginInput): String!
  }

  input AddTeamInput {
    name: String!
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }
`;