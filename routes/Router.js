const express = require("express");
const router = express();

// Rotas relacionadas aos usuários
router.use("/api/users", require("./UserRoutes"));

module.exports = router;
