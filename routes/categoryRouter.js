var express = require("express");
var router = express.Router();
const categoryController = require("../controller/categoryController");
const upload = require("../middleware/multerConfig");
const passport = require("../middleware/passpostJWT");

// http://localhost:3000/categories
router.get("/", categoryController.showAll);

// http://localhost:3000/categories/create
router.post(
  "/create",
  upload.single("image"),
  [passport.isLogin, passport.isAdmin],
  categoryController.create
);

// http://localhost:3000/categories/pagination?page=1&limit=5
router.get("/pagination", categoryController.getPagination);

// http://localhost:3000/categories/:id
router.get("/:id", categoryController.showById);

// http://localhost:3000/categories/:id
router.put(
  "/:id",
  [passport.isLogin, passport.isAdmin],
  categoryController.update
);

// http://localhost:3000/categories/:id
router.delete(
  "/:id",
  [passport.isLogin, passport.isAdmin],
  categoryController.delete
);

module.exports = router;
