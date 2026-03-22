/**
 * En local / hors production, on renvoie le détail Prisma pour déboguer.
 * En production, seul le message générique est exposé.
 */
export const exposeErrorDetails = () =>
  process.env.NODE_ENV !== "production" || process.env.DEBUG_API === "1";

export function jsonServerError(res, error, label) {
  console.error(`[${label}]`, error?.stack || error);
  return res.status(500).json({
    success: false,
    message: "Erreur interne du serveur",
    ...(exposeErrorDetails() && {
      detail: error?.message,
      code: error?.code,
      name: error?.name,
    }),
  });
}
