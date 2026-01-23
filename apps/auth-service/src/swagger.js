const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Auth Service API",
    description: "Automatically generated Swagger docs",
    version: "1.0.0",
  },
  host: "localhost:6001",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endPointsFiles = ["./routes/auth-router.ts"]; // correct path

swaggerAutogen(outputFile, endPointsFiles, doc)
  .then(() => {
    console.log("Swagger generated!");
  })
  .catch((err) => console.error(err));
