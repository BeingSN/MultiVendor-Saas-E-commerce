// const swaggerAutogen = require("swagger-autogen")();

// const doc = {
//   info: {
//     title: "Auth Service API",
//     description: "Automatically generated Swagger docs",
//     version: "1.0.0",

//   },
//   host: "localhost:6001",
//   schemes: ["http"],
//    basePath: "/api",

// };

// const outputFile = "./swagger-output.json";
// const endPointsFiles = ["./routes/auth-router.ts"]; // correct path

// swaggerAutogen(outputFile, endPointsFiles, doc)
//   .then(() => {
//     console.log("Swagger generated!");
//   })
//   .catch((err) => console.error(err));

import swaggerAutogen from "swagger-autogen";
import { join } from "path";

const swagger = swaggerAutogen({ openapi: "3.0.0" });

// Output file for generated swagger JSON
const outputFile = join(
  process.cwd(),
  "apps/auth-service/src/swagger-output.json",
);

// Your route files (source files, NOT dist!)
const endpointsFiles = [
  join(process.cwd(), "apps/auth-service/src/routes/auth-router.ts"),
];

// Swagger document definition
const doc = {
  info: {
    title: "Auth Service API",
    description: "Automatically generated Swagger docs",
    version: "1.0.0",
  },

  host: "localhost:6001",
  schemes: ["http"],
  basePath: "/api", // all routes are under /api
  // optional: you can add securityDefinitions, tags, etc.
};

// Wrap swaggerAutogen to prepend /api automatically
swagger(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log("Swagger generated!");
    console.log(
      "👉 Access JSON at http://localhost:6001/docs-json or Swagger UI at /api-docs",
    );
  })
  .catch((err) => console.error(err));
