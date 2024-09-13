var express = require("express");
var router = express.Router();
const productController = require("../controller/productController");
const upload = require("../middleware/multerConfig");
const passport = require("../middleware/passpostJWT");

// http://localhost:3000/products
router.get("/", productController.showAll);

// http://localhost:3000/products/create
router.post(
  "/create",
  upload.single("image"),
  [passport.isLogin, passport.isAdmin],
  productController.create
);

//http://localhost:3000/products/pagination?page=1&limit=5
router.get("/pagination", productController.getPagination);

// http://localhost:3000/products/:id
router.get("/:id", productController.showById);

//localhost:3000/products/:id
router.put(
  "/:id",
  upload.single("image"),
  [passport.isLogin, passport.isAdmin],
  productController.update
);

// http://localhost:3000/products/:id
router.delete(
  "/:id",
  [passport.isLogin, passport.isAdmin],
  productController.delete
);

module.exports = router;
