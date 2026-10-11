const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

// root path: /articles
router
  .route("/")
  .post(articleController.getAllArticles)
  .patch(articleController.updateArticle);

router.route("/create").post(articleController.createNewArticle);
router.route("/:id").delete(articleController.deleteArticle);

module.exports = router;
