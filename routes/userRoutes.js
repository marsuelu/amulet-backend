const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

// router.use(verifyJWT);

router
  .route("/")
  .get(verifyJWT, userController.getAllUsers)
  .patch(verifyJWT, userController.updateUser);

router.route("/register").post(userController.createNewUser);

router
  .route("/:id")
  .get(verifyJWT, userController.deleteUser)
  .delete(verifyJWT, userController.deleteUser);

module.exports = router;
