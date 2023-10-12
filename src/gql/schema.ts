export const typeDefs = `#graphql
  type User {
    name: String!
    email: String!
    id: Int!
  }

  type Team {
    name: String!
    id: Int!
  }

  enum Status {
    Open 
    Done 
    In_progress
  }

  type CardRaw {
    title: String!
    id: String!
    assigneeId: Int!
    createdAt: String!
    dueDateTime: String!
    teamId: Int!
    status: Status!
  }

  type Card {
    title: String!
    id: String!
    assignee: User!
    createdAt: String!
    dueDateTime: String!
    teamId: Int!
    status: Status!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
    teams: [Team!]!
    team(id: Int!): Team
    teamMembers(id: Int!): [User!]!
    cards: [CardRaw!]!
    card(id: String!): Card
  }
`;