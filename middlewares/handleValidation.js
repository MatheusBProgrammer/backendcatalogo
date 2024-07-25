// Importa a função `validationResult` do pacote express-validator
const { validationResult } = require("express-validator");

// Middleware de validação e exibição dos erros
const validate = (req, res, next) => {
  // Verifica se há erros de validação na requisição
  const errors = validationResult(req);

  // Se não houver erros, continua para o próximo middleware
  if (errors.isEmpty()) {
    return next();
  }

  // Se houver erros, os transforma em um formato adequado para resposta
  const extractedErrors = [];

  // Transforma os erros em um array e os insere em extractedErrors
  errors.array().map((err) => extractedErrors.push(err));

  // Retorna uma resposta de erro com status 422 (Unprocessable Entity) e os erros extraídos
  return res.status(422).json({
    errors: extractedErrors,
  });
};

// Exporta a função de validação para uso em outros arquivos
module.exports = validate;
