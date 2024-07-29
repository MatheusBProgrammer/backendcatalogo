const { body, validationResult } = require("express-validator");

// Validação para registrar uma nova clínica
const clinicaRegisterValidation = () => {
  return [
    body("nome")
      .notEmpty()
      .withMessage("O nome é obrigatório")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres"),
    body("endereco").notEmpty().withMessage("O endereço é obrigatório"),
    body("telefone").notEmpty().withMessage("O telefone é obrigatório"),
    body("email")
      .notEmpty()
      .withMessage("O email é obrigatório")
      .isEmail()
      .withMessage("O email deve ser válido"),
    body("senha")
      .notEmpty()
      .withMessage("A senha é obrigatória")
      .isString()
      .withMessage("A senha precisa ser uma string"),
    body("descricao").notEmpty().withMessage("A descrição é obrigatória"),
    body("horarioFuncionamento")
      .notEmpty()
      .withMessage("O horário de funcionamento é obrigatório"),
    body("tiposDeAtendimento")
      .notEmpty()
      .withMessage("Os tipos de atendimento são obrigatórios"),
  ];
};

// Validação para atualizar uma clínica
const clinicaUpdateValidation = () => {
  return [
    body("nome")
      .optional()
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres"),
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
  clinicaRegisterValidation,
  clinicaUpdateValidation,
  validate,
};
