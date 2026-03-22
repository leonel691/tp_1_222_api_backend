import "../env.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

/**
 * Établit la connexion au démarrage (sinon Prisma se connecte au premier accès).
 */
export async function connectDatabase() {
  await prisma.$connect();
  console.log("Base de données connectée avec succès.");
}

export default prisma;
