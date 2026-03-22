import Article from "../models/Article.js";
import { jsonServerError } from "../utils/apiError.js";

/**
 * POST /api/articles
 * Crée un nouvel article
 */
export const createArticle = async (req, res) => {
  try {
    const { titre, contenu, auteur, date, categorie, tags } = req.body;

    const article = await Article.create({
      titre,
      contenu,
      auteur,
      categorie,
      tags: tags || [],
      date: date ? new Date(date) : new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Article créé avec succès",
      data: article,
    });
  } catch (error) {
    return jsonServerError(res, error, "createArticle");
  }
};

const firstQueryValue = (value) => {
  if (value === undefined || value === null) return undefined;
  return Array.isArray(value) ? value[0] : value;
};

/**
 * GET /api/articles
 * Récupère tous les articles (avec filtres optionnels : categorie, auteur, date)
 */
export const getArticles = async (req, res) => {
  try {
    const categorie = firstQueryValue(req.query.categorie);
    const auteur = firstQueryValue(req.query.auteur);
    const date = firstQueryValue(req.query.date);

    if (date !== undefined && date !== "") {
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Paramètre date invalide (ex. YYYY-MM-DD ou date ISO)",
        });
      }
    }

    const articles = await Article.findAll({ categorie, auteur, date });

    return res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    if (error.message?.includes("Filtre date invalide")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return jsonServerError(res, error, "getArticles");
  }
};

/**
 * GET /api/articles/search?query=...
 * Recherche full-text sur titre et contenu
 */
export const searchArticles = async (req, res) => {
  try {
    const query = firstQueryValue(req.query.query);
    const articles = await Article.search(query);

    return res.status(200).json({
      success: true,
      count: articles.length,
      query,
      data: articles,
    });
  } catch (error) {
    return jsonServerError(res, error, "searchArticles");
  }
};

/**
 * GET /api/articles/:id
 * Récupère un article par son ID
 */
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: "Article non trouvé" });
    }

    return res.status(200).json({ success: true, data: article });
  } catch (error) {
    console.error("[getArticleById]", error?.stack || error);
    if (error.code === "P2023" || error.message?.includes("ObjectId")) {
      return res.status(400).json({ success: false, message: "ID invalide" });
    }
    return jsonServerError(res, error, "getArticleById");
  }
};

/**
 * PUT /api/articles/:id
 * Met à jour un article
 */
export const updateArticle = async (req, res) => {
  try {
    const allowedFields = ["titre", "contenu", "categorie", "tags", "date"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = field === "date" ? new Date(req.body[field]) : req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "Aucun champ à mettre à jour" });
    }

    const article = await Article.update(req.params.id, updateData);

    return res.status(200).json({
      success: true,
      message: "Article mis à jour avec succès",
      data: article,
    });
  } catch (error) {
    console.error("[updateArticle]", error?.stack || error);
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Article non trouvé" });
    }
    if (error.code === "P2023" || error.message?.includes("ObjectId")) {
      return res.status(400).json({ success: false, message: "ID invalide" });
    }
    return jsonServerError(res, error, "updateArticle");
  }
};

/**
 * DELETE /api/articles/:id
 * Supprime un article
 */
export const deleteArticle = async (req, res) => {
  try {
    await Article.delete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Article supprimé avec succès",
      id: req.params.id,
    });
  } catch (error) {
    console.error("[deleteArticle]", error?.stack || error);
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Article non trouvé" });
    }
    if (error.code === "P2023" || error.message?.includes("ObjectId")) {
      return res.status(400).json({ success: false, message: "ID invalide" });
    }
    return jsonServerError(res, error, "deleteArticle");
  }
};
