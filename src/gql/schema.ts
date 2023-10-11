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

  type Query {
    users: [User!]!
    user(id: Int!): User
    teams: [Team!]!
    team(id: Int!): Team
    teamMembers(id: Int!): [User!]!
  }
`;