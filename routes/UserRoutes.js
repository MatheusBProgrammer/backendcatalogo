const express = require("express");
const router = express.Router();

//controller
const {
  register,
  login,
  getCurrentUser,
  updateUser,
  getUserById,
} = require("../controllers/UserController");

// Middlewares
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidations");
const imageUpload = require("../middlewares/imageUpload");

//routes
router.post("/register", imageUpload.single("profileImage"), register);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", getCurrentUser);
router.put(
  "/",
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  updateUser
);
router.get("/:id", getUserById);

module.exports = router;
