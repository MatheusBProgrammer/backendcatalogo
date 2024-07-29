const { body, validationResult } = require("express-validator");

// Validação para registrar um novo profissional
const profissionalRegisterValidation = () => {
  return [
    body("nomeCompleto")
      .notEmpty()
      .withMessage("O nome completo é obrigatório")
      .isLength({ min: 3 })
      .withMessage("O nome completo precisa ter no mínimo 3 caracteres"),
    body("especialidade")
      .notEmpty()
      .withMessage("A especialidade é obrigatória"),
    body("numeroRegistro")
      .notEmpty()
      .withMessage("O número de registro é obrigatório"),
    body("instituicaoEnsino")
      .notEmpty()
      .withMessage("A instituição de ensino é obrigatória"),
    body("telefone").notEmpty().withMessage("O telefone é obrigatório"),
    body("email")
      .notEmpty()
      .withMessage("O email é obrigatório")
      .isEmail()
      .withMessage("O email deve ser válido"),
    body("senha").notEmpty().withMessage("A senha é obrigatória"),
    body("descricaoPessoal")
      .notEmpty()
      .withMessage("A descrição pessoal é obrigatória"),
  ];
};

// Validação para atualizar um profissional
const profissionalUpdateValidation = () => {
  return [
    body("nomeCompleto")
      .optional()
      .isLength({ min: 3 })
      .withMessage("O nome completo precisa ter no mínimo 3 caracteres"),
    body("email").optional().isEmail().withMessage("O email deve ser válido"),
  ];
};

// Middleware para verificar os resultados das validações
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  profissionalRegisterValidation,
  profissionalUpdateValidation,
  validate,
};
