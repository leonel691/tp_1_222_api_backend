// Charger .env avant tout module qui lit process.env (Prisma, Swagger, etc.)
import "./src/env.js";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";
import articlesRouter from "./src/routes/articles.js";
import { connectDatabase } from "./src/config/database.js";
import { jsonServerError } from "./src/utils/apiError.js";

await connectDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "salut et bienvenu sur mon api backend" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/articles", articlesRouter);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  return jsonServerError(res, err, "express");
});

app.listen(PORT, () => {
  console.log(`notre serveur tourne sur le port ${PORT} avec succes`);
});
