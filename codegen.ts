import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/gql/schema.graphql",
  generates: {
    "./src/gql/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    }
  }
}

export default config;
