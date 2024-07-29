// models/Profissional.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definindo o esquema para o Profissional
const profissionalSchema = new Schema(
  {
    nomeCompleto: {
      type: String,
      required: true,
      trim: true,
    },
    especialidade: {
      type: String,
      required: true,
    },
    numeroRegistro: {
      type: String,
      required: true,
      unique: true,
    },
    instituicaoEnsino: {
      type: String,
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
    descricaoPessoal: {
      type: String,
      trim: true,
    },
    perfilImagem: {
      type: String,
    },
  },
  { timestamps: true }
); // Adiciona campos de createdAt e updatedAt

// Criar o modelo a partir do esquema
const Profissional = mongoose.model("Profissional", profissionalSchema);

module.exports = Profissional;
