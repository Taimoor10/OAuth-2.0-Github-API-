import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import express from "express";
import YAML from "yamljs";

const swaggerDefinition = YAML.load('src/swagger.yaml');

const options = {
  swaggerDefinition,
  apis: ["./src/routes/github.ts", "./src/routes/user.ts"]
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: express.Express) {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}
