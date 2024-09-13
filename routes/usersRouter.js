var express = require("express");
var router = express.Router();
const userController = require("../controller/userController");
const upload = require("../middleware/multerConfig");
const passport = require("../middleware/passpostJWT");

// http://localhost:3000/users
router.get("/", [passport.isLogin, passport.isAdmin], userController.showAll);

//http://localhost:3000/users/pagination?page=1&limit=5
router.get("/pagination", userController.getPagination);

// http://localhost:3000/users/:id
router.get("/:id", [passport.isLogin], userController.showById);

// http://localhost:3000/users/register
router.post("/register", upload.single("image"), userController.register);

// http://localhost:3000/users/login
router.post("/login", userController.login);

// http://localhost:3000/users/:id
router.put(
  "/:id",
  upload.single("image"),
  [passport.isLogin],
  userController.update
);

// http://localhost:3000/users/:id
router.delete("/:id", userController.delete);

module.exports = router;
