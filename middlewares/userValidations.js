const { body } = require("express-validator");

const userCreateValidation = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("O nome é obrigatório")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres"),
    body("email")
      .notEmpty()
      .withMessage("O email é obrigatório")
      .isEmail()
      .withMessage("O email deve ser válido"),
    body("password")
      .notEmpty()
      .withMessage("A senha é obrigatória")
      .isString()
      .withMessage("A senha deve ser uma string")
      // Adicionando validação personalizada para a senha
      .custom((value, { req }) => {
        // Verifica se a senha contém pelo menos um caractere maiúsculo, um minúsculo e um número
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          throw new Error(
            "A senha deve conter pelo menos um caractere maiúsculo, um minúsculo e um número"
          );
        }

        // Retorna true se a senha atender aos critérios
        return true;
      }),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("O email é obrigatório")
      .isEmail()
      .withMessage("Insira um email válido"),

    body("password").isString().withMessage("A senha é obrigatória"),
  ];
};

const userUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("O nome precisa de no mínimo 3 caracteres"),
    body("password")
      .optional()
      .isLength({ min: 5 })
      .withMessage("A senha precisa ter no mínimo 5 caracteres"),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
