import { body, param, query, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Données invalides",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

export const validateCreate = [
  body("titre")
    .notEmpty()
    .withMessage("Le titre est obligatoire")
    .isLength({ min: 3, max: 255 })
    .withMessage("Le titre doit contenir entre 3 et 255 caractères"),
  body("contenu")
    .notEmpty()
    .withMessage("Le contenu est obligatoire")
    .isLength({ min: 10 })
    .withMessage("Le contenu doit contenir au moins 10 caractères"),
  body("auteur")
    .notEmpty()
    .withMessage("L'auteur est obligatoire")
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom d'auteur doit contenir entre 2 et 100 caractères"),
  body("categorie").notEmpty().withMessage("La catégorie est obligatoire"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("La date doit être au format ISO 8601 (ex: 2026-03-18T10:00:00Z)"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Les tags doivent être un tableau")
    .custom((tags) => tags.every((t) => typeof t === "string"))
    .withMessage("Chaque tag doit être une chaîne"),
  handleValidationErrors,
];

export const validateUpdate = [
  param("id").notEmpty().withMessage("L'ID est obligatoire"),
  body("titre")
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage("Le titre doit contenir entre 3 et 255 caractères"),
  body("contenu")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Le contenu doit contenir au moins 10 caractères"),
  body("categorie").optional().notEmpty().withMessage("La catégorie ne peut pas être vide"),
  body("tags").optional().isArray().withMessage("Les tags doivent être un tableau"),
  body("date").optional().isISO8601().withMessage("La date doit être au format ISO 8601"),
  handleValidationErrors,
];

export const validateId = [
  param("id").notEmpty().withMessage("L'ID est requis"),
  handleValidationErrors,
];

export const validateSearch = [
  query("query")
    .notEmpty()
    .withMessage('Le paramètre "query" est requis')
    .isLength({ min: 2 })
    .withMessage("La recherche doit contenir au moins 2 caractères"),
  handleValidationErrors,
];
