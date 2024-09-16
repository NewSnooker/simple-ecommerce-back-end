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
      Category: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "รหัสหมวดหมู่ (ID)",
            example: "60b7dce3f9d8f761d4a0e2c0",
          },
          name: {
            type: "string",
            description: "ชื่อของหมวดหมู่",
            example: "อิเล็กทรอนิกส์",
          },
          description: {
            type: "string",
            description: "คำอธิบายของหมวดหมู่",
            example: "หมวดหมู่สำหรับสินค้าประเภทอิเล็กทรอนิกส์",
          },
        },
        required: ["name"],
        additionalProperties: false,
      },
      Product: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "รหัสสินค้า (ID)",
            example: "60b7dce3f9d8f761d4a0e2c0",
          },
          name: {
            type: "string",
            description: "ชื่อสินค้า",
            example: "โทรศัพท์มือถือ",
          },
          price: {
            type: "number",
            description: "ราคาสินค้า",
            example: 29999,
          },
          quantity: {
            type: "number",
            description: "จำนวนสินค้าที่มีอยู่",
            example: 10,
          },
          category: {
            type: "string",
            description: "รหัสหมวดหมู่ที่สินค้าสังกัดอยู่",
            example: "60b7dce3f9d8f761d4a0e2c0",
          },
          description: {
            type: "string",
            description: "คำอธิบายของสินค้า",
            example: "สมาร์ทโฟนสุดล้ำที่มีฟีเจอร์ครบครัน",
          },
          image: {
            type: "string",
            description: "ลิงก์ไปยังภาพของสินค้า",
            example: "https://storage.googleapis.com/bucket/image.png",
          },
        },
        required: ["name", "price", "quantity", "category"],
        additionalProperties: false,
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Update the path to where your routes are located
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec, swaggerUi };
