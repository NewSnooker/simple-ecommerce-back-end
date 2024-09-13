const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API Simple Ecommerce",
    version: "1.0.0",
    description: "This is the API documentation for the Simple Ecommerce.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://simple-ecommerce-back-end.vercel.app",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          username: {
            type: "string",
            description: "The user's username",
            example: "johndoe",
          },
          email: {
            type: "string",
            description: "The user's email address",
            example: "johndoe@example.com",
          },
          password: {
            type: "string",
            description: "The user's password (should be hashed in practice)",
            example: "mypassword123",
          },
          image: {
            type: "string",
            description: "The URL or path to the user's profile image",
            example: "nopic.png",
          },
          role: {
            type: "string",
            description: "The role of the user",
            example: "member",
          },
        },
        required: ["username", "email", "password"],
        additionalProperties: false,
      },
    },
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec, swaggerUi };
