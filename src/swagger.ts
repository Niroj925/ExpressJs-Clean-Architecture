import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export function setupSwagger(app: Express) {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Trading Bot API",
        version: "1.0.0",
        description: "API documentation for the Trading Bot project",
      },
       servers: [
      { url: "http://localhost:4040/api" }  
    ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [{ BearerAuth: [] }],
    },
    // Use project-relative globs (swagger-jsdoc resolves from process.cwd())
    apis: [
      "src/presentation/router/*.ts",
      "src/presentation/dto/request/*.ts",
      "src/presentation/api/*.ts",
      "src/application/use-cases/**/**/*.ts",
    ],
  };

  const swaggerSpec = swaggerJsdoc(options);

  const swaggerUiOptions = {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

  // For Postman or programmatic import
  app.get("/swagger.json", (req, res) => {
    res.json(swaggerSpec);
  });
}

export default setupSwagger;
