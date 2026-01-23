import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrate: {
    adapter: {
      provider: "mongodb",
      url: process.env.DATABASE_URL,
    },
  },
});
