import path from "path";
import { fileURLToPath } from "url";
import swaggerJsdoc from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description:
        "API REST pour la gestion d'articles de blog — MVC avec Express, MongoDB & Prisma",
      contact: {
        name: "Blog API Support",
      },
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:3000",
        description:
          process.env.NODE_ENV === "production" ? "Serveur de production" : "Serveur de développement",
      },
    ],
    components: {
      schemas: {
        Article: {
          type: "object",
          required: ["titre", "contenu", "auteur", "categorie"],
          properties: {
            id: {
              type: "string",
              description: "Identifiant MongoDB ObjectId",
              example: "65f1a2b3c4d5e6f7a8b9c0d1",
            },
            titre: {
              type: "string",
              description: "Titre de l'article",
              example: "Introduction à Prisma avec MongoDB",
            },
            contenu: {
              type: "string",
              description: "Corps de l'article",
              example: "Prisma est un ORM moderne pour Node.js...",
            },
            auteur: {
              type: "string",
              description: "Nom de l'auteur",
              example: "Jean Dupont",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Date de publication",
              example: "2026-03-18T10:00:00.000Z",
            },
            categorie: {
              type: "string",
              description: "Catégorie de l'article",
              example: "Tech",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Liste de tags",
              example: ["nodejs", "prisma", "mongodb"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        ArticleInput: {
          type: "object",
          required: ["titre", "contenu", "auteur", "categorie"],
          properties: {
            titre: { type: "string", example: "Mon premier article" },
            contenu: { type: "string", example: "Contenu de l'article..." },
            auteur: { type: "string", example: "Jane Doe" },
            date: { type: "string", format: "date-time", example: "2026-03-18T10:00:00.000Z" },
            categorie: { type: "string", example: "Tech" },
            tags: { type: "array", items: { type: "string" }, example: ["express", "api"] },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Article non trouvé" },
            errors: { type: "array", items: { type: "object" } },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "../routes/*.js")],
};

export default swaggerJsdoc(options);
