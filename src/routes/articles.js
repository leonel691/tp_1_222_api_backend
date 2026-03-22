import { Router } from "express";
import {
  createArticle,
  getArticles,
  searchArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";
import {
  validateCreate,
  validateUpdate,
  validateId,
  validateSearch,
} from "../middlewares/validators.js";

const router = Router();

// ⚠️  /search DOIT être déclaré avant /:id pour éviter que "search" soit traité comme un ID
/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Recherche full-text dans les articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Texte à rechercher dans le titre ou le contenu
 *         example: "Prisma"
 *     responses:
 *       200:
 *         description: Articles correspondant à la recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: integer }
 *                 query: { type: string }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/search", validateSearch, searchArticles);

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupère tous les articles (filtrés optionnellement)
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: categorie
 *         schema: { type: string }
 *         description: Filtre par catégorie
 *         example: "Tech"
 *       - in: query
 *         name: auteur
 *         schema: { type: string }
 *         description: Filtre par auteur (recherche partielle)
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *         description: Filtre par date (YYYY-MM-DD)
 *         example: "2026-03-18"
 *     responses:
 *       200:
 *         description: Liste des articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 count: { type: integer }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       500:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getArticles);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Crée un nouvel article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", validateCreate, createArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupère un article par son ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ID MongoDB de l'article
 *         example: "65f1a2b3c4d5e6f7a8b9c0d1"
 *     responses:
 *       200:
 *         description: Article trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Article non trouvé
 */
router.get("/:id", validateId, getArticleById);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Met à jour un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre: { type: string }
 *               contenu: { type: string }
 *               categorie: { type: string }
 *               tags: { type: array, items: { type: string } }
 *               date: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Article mis à jour
 *       400:
 *         description: Données invalides ou ID invalide
 *       404:
 *         description: Article non trouvé
 */
router.put("/:id", validateUpdate, updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprime un article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Article supprimé avec succès
 *       404:
 *         description: Article non trouvé
 */
router.delete("/:id", validateId, deleteArticle);

export default router;
