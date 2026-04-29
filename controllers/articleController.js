const Article = require("../models/Article.js");
const Segment = require("segment");
const segment = new Segment();
segment.useDefault();

const getKeywords = (title, summary) => {
  return segment.doSegment(`${title}。${summary}`, {
    simple: true,
    stripStopword: true,
  });
};
// @desc Get all articles
// @route GET /articles
// @access Private
const getAllArticles = async (req, res) => {
  try {
    const { updatedAt = null, createdAt = null, keywords = null } = req.body;
    let query = {};
    let sortOptions = { [updatedAt || createdAt || "updatedAt"]: -1 };

    if (keywords && keywords.trim() !== "") {
      query = { keywords: { $in: keywords.trim().split(/\s+/) } };
    }
    // const results = await Article.find(query).sort(sortOptions);
    const results = await Article.find()
      .where("keywords")
      .all(keywords.trim().split(/\s+/))
      .sort(sortOptions);
    res.status(200).json({
      total: results.length || 0,
      data: results || [],
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
    const keywords = getKeywords(title, summary);
    await Article.create({
      title,
      summary,
      slug,
      keywords,
      content,
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
    // 1.check if the slug is duplicated
    const dupSlugList = await Article.find({ slug, _id: { $ne: id } }).lean();
    if (dupSlugList && dupSlugList.length)
      return res
        .status(409)
        .json({ message: "Url for this article is duplicated." });
    // 2.check if the article is found
    const oldArticle = await Article.findById(id).lean();
    if (!oldArticle)
      return res.status(400).json({ message: "Original article not found." });
    // 3.update the article
    const newObj = {
      updatedBy,
      ...(title && { title }),
      ...(content && { content }),
      ...(summary && { summary }),
      ...(status && { status }),
      ...(slug && { slug }),
    };
    if (title || summary) {
      const newTitle = title || oldArticle.title;
      const newSummary = summary || oldArticle.summary;
      const newKeywords = getKeywords(newTitle, newSummary);
      newObj.keywords = newKeywords;
    }
    await Article.findOneAndUpdate({ _id: id }, newObj);
    return res.status(201).json({ message: `Article ${title} has updated.` });
  } catch (error) {
    return res.status(400).json({
      message: error._message ?? error.message ?? "Invalid data received.",
    });
  }
};

// @desc Delete
// @route DELETE /articles/:id
// @access Private
const deleteArticle = async (req, res) => {
  const { id } = req.params;
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
