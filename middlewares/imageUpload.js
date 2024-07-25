// middlewares/imageUpload.js
const multer = require("multer");

// Configurar Multer para armazenar arquivos na memória
const storage = multer.memoryStorage();

// Middleware de upload de imagem
const imageUpload = multer({
  storage, // Utiliza a configuração de armazenamento em memória
  fileFilter: (req, file, cb) => {
    // Aceitar apenas fotos nos formatos JPG ou PNG
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return cb(
        new Error("Por favor, envie apenas fotos nos formatos JPG ou PNG"),
        false
      );
    }
    cb(null, true);
  },
});

module.exports = imageUpload;
