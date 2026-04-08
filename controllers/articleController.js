const Article = require("../models/Article.js");
const bcrypt = require("bcrypt");
const RegExp = require("../config/regExp");

// @desc Get all articles
// @route GET /articles
// @access Private
const getAllArticles = async (req, res) => {
  try {
    // 1. Extract
    let query;
    const { updatedAt = null, createdAt = null, keywords = null } = req.body;
    if (keywords) {
      const regex = new RegExp(keywords, "i");
      query = Article.find({
        $or: [{ title: { $regex: regex } }, { summary: { $regex: regex } }],
      });
    } else {
      query = Article.find();
    }
    if (updatedAt) {
      query = query.sort({ updatedAt });
    } else if (createdAt) {
      query = query.sort({ createdAt });
    } else {
      query = query.sort("-updatedAt");
    }

    // 2. Execute the query
    const list = await query;

    res.status(200).json({
      total: list.length,
      data: list,
    });
  } catch (error) {
    res.status(400).json({
      message: error._message ?? error.message ?? "Failed to get articles.",
    });
  }
};

// @desc Create new articles
// @route POST /articles
// @access Private
const createNewArticle = async (req, res) => {
  try {
    const { title, content, slug, summary, status, createdBy, updatedBy } =
      req.body;
    if (!title || !content || !slug || !summary) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const dupSlug = await Article.findOne({ slug }).lean();
    if (dupSlug)
      return res
        .status(409)
        .json({ message: "Url for this article is duplicated." });

    await Article.create({
      title,
      content,
      slug,
      summary,
      status,
      createdBy,
      updatedBy,
    });
    res.status(201).json({ message: `New article ${title} created.` });
  } catch (error) {
    res
      .status(400)
      .json({ message: error._message ?? "Invalid article data received." });
  }
};

// @desc Update article
// @route PATCH /articles
// @access Private
const updateArticle = async (req, res) => {
  const { title, content, summary, status, updatedBy, id, slug } = req.body;
  if (!updatedBy || !id || !(title || content || summary || status || slug)) {
    return res.status(400).json({ message: "Update fields are required!" });
  }
  try {
    const dupSlugList = await Article.find({ slug, _id: { $ne: id } }).lean();
    if (dupSlugList && dupSlugList.length)
      return res
        .status(409)
        .json({ message: "Url for this article is duplicated." });
    const newObj = {
      updatedBy,
      ...(title && { title }),
      ...(content && { content }),
      ...(summary && { summary }),
      ...(status && { status }),
      ...(slug && { slug }),
    };
    const article = await Article.findOneAndUpdate({ _id: id }, newObj);
    if (!article) throw new Error("Could not find a matched article.");
    return res.status(201).json({ message: `Article ${title} has updated.` });
  } catch (error) {
    return res.status(400).json({
      message: error._message ?? error.message ?? "Invalid data received.",
    });
  }
};

// @desc Delete
// @route DELETE /articles
// @access Private
const deleteArticle = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Give me valid article id." });
  }
  try {
    const article = await Article.findOneAndDelete({ _id: id });
    if (!article) throw new Error("Could not find a matched article.");
    return res
      .status(200)
      .json({ message: `Article ${article.title} has been deleted forever.` });
  } catch (error) {
    return res.status(400).json({
      message:
        error._message ?? error.message ?? "Invalid article data received.",
    });
  }
};

module.exports = {
  getAllArticles,
  createNewArticle,
  updateArticle,
  deleteArticle,
};
