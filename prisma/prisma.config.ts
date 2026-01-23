import { defineDatasource } from "@prisma/client";

export const db = defineDatasource({
  name: "db",
  provider: "mongodb",
  adapter: process.env.DATABASE_URL, // your MongoDB URL
});
