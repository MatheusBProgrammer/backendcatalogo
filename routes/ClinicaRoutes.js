const express = require("express");
const router = express.Router();

// Controllers
const {
  registerClinica,
  updateClinica,
  getById,
} = require("../controllers/clinicaController");
// Middlewares
const {
  clinicaRegisterValidation,
  clinicaUpdateValidation,
  validate,
} = require("../middlewares/clinicaValidation");
const imageUpload = require("../middlewares/imageUpload");

// Rotas para clínica
router.post(
  "/clinica/register",
  imageUpload.single("logoImagem"),
  clinicaRegisterValidation(),
  validate,
  registerClinica
);
router.put(
  "/clinica/update",
  imageUpload.single("logoImagem"),
  clinicaUpdateValidation(),
  validate,
  updateClinica
);
router.get("/clinica/:id", getById);

module.exports = router;
