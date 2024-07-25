/*
Este arquivo configura e inicializa o servidor Express para a aplicação.
Ele define as configurações principais, como porta, middleware para lidar com JSON e FormData,
permitindo requisições de diferentes origens usando CORS, e define as rotas da aplicação.
*/

require("dotenv").config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT; // Obtém a porta do arquivo .env

const app = express();

// Middleware para lidar com JSON e FormData nas requisições
app.use(express.urlencoded({ extended: false }));

// Middleware para permitir requisições de diferentes origens usando CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Rotas da aplicação
const router = require("./routes/Router.js");
app.use(router);

// Middleware para servir arquivos estáticos da pasta de uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Conexão com o banco de dados
require("./config/db.js")();

// Inicializa o servidor na porta especificada
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
