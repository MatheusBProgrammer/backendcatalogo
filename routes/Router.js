const express = require("express");
const router = express();

// Rotas relacionadas aos usuários
router.use("/api/clinica", require("./ClinicaRoutes"));
router.use("/api/profissional", require("./ProfissionalRoutes"));

module.exports = router;
