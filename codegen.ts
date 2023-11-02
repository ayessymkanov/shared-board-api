import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/gql/schema.graphql",
  generates: {
    "./src/gql/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
  config: {
    mappers: {
      User: ".prisma/client#User as UserModel",
      Card: ".prisma/client#Card as CardModel",
      Team: ".prisma/client#Team as TeamModel",
    },
    inputMaybeValue: "undefined | T",
    allowParentTypeOverride: true,
  },
}

export default config;
