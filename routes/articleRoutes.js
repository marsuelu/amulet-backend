const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");

router
  .route("/")
  .post(articleController.getAllArticles)
  .post(articleController.createNewArticle)
  .patch(articleController.updateArticle);

router.route("/:id").delete(articleController.deleteArticle);

module.exports = router;
