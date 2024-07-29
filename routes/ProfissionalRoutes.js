const express = require("express");
const router = express.Router();

// Controllers
const {
  registerProfissional,
  updateProfissional,
  getProfissionalById,
} = require("../controllers/profissionalController");

// Middlewares
const {
  profissionalRegisterValidation,
  profissionalUpdateValidation,
  validate,
} = require("../middlewares/profissionalValidation.js");
const imageUpload = require("../middlewares/imageUpload");

// Rotas para profissional
router.post(
  "/register",
  imageUpload.single("perfilImagem"),
  profissionalRegisterValidation(),
  validate,
  registerProfissional
);
router.put(
  "/update",
  imageUpload.single("perfilImagem"),
  profissionalUpdateValidation(),
  validate,
  updateProfissional
);
router.get("/:id", getProfissionalById);

module.exports = router;
