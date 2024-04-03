import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger-output.json";
const routes = ["./src/routes/index.js"];

const doc = {
  info: {
    title: "Just Go API",
    description: "",
  },
  servers: [
    {
      url: "http://localhost",
      description: "local",
    },
    {
      url: "https://just-go-api.voidcloud.net",
      description: "remote",
    },
  ],
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
