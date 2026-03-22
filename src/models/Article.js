import prisma from "../config/database.js";

/**
 * Article Model — couche d'abstraction repository au-dessus de Prisma.
 * Toute interaction avec la collection Article passe ici.
 */
const Article = {
  async create(data) {
    return prisma.article.create({ data });
  },

  /**
   * @param {Object} filters - { categorie?, auteur?, date? }
   */
  async findAll(filters = {}) {
    const where = {};

    if (filters.categorie) {
      where.categorie = { equals: filters.categorie };
    }
    if (filters.auteur) {
      where.auteur = { contains: filters.auteur };
    }
    if (filters.date) {
      const start = new Date(filters.date);
      if (Number.isNaN(start.getTime())) {
        throw new Error("Filtre date invalide (utilise YYYY-MM-DD ou une date ISO)");
      }
      const end = new Date(filters.date);
      end.setDate(end.getDate() + 1);
      where.date = { gte: start, lt: end };
    }

    return prisma.article.findMany({
      where,
      orderBy: { date: "desc" },
    });
  },

  async findById(id) {
    return prisma.article.findUnique({ where: { id } });
  },

  async search(query) {
    return prisma.article.findMany({
      where: {
        OR: [{ titre: { contains: query } }, { contenu: { contains: query } }],
      },
      orderBy: { date: "desc" },
    });
  },

  async update(id, data) {
    return prisma.article.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.article.delete({ where: { id } });
  },
};

export default Article;
