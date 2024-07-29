// models/Clinica.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definindo o esquema para a Clínica
const clinicaSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    endereco: {
      rua: {
        type: String,
        required: true,
        trim: true,
      },
      numero: {
        type: String,
        required: true,
      },
      complemento: {
        type: String,
        trim: true,
      },
      bairro: {
        type: String,
        required: true,
        trim: true,
      },
      cidade: {
        type: String,
        required: true,
        trim: true,
      },
      estado: {
        type: String,
        required: true,
        trim: true,
      },
      cep: {
        type: String,
        required: true,
      },
    },
    telefone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    senha: {
      type: String,
      required: true,
      unique: false,
      trim: true,
    },
    descricao: {
      type: String,
      trim: true,
    },
    tiposDeAtendimento: [
      {
        nome: {
          type: String,
          required: true,
        },
        descricao: {
          type: String,
        },
        profissionais: [
          {
            nome: {
              type: String,
            },
            especialidade: {
              type: String,
            },
          },
        ],
        horariosDisponiveis: {
          segunda_a_sexta: {
            type: String,
          },
          sabado: {
            type: String,
          },
        },
      },
    ],
    logoImagem: {
      type: String,
    },
  },
  { timestamps: true }
); // Adiciona campos de createdAt e updatedAt

// Criar o modelo a partir do esquema
const Clinica = mongoose.model("Clinica", clinicaSchema);

module.exports = Clinica;
