// controllers/clinicaController.js
const Clinica = require("../models/Clinica"); // Modelo para Clínica
const bcrypt = require("bcryptjs"); // Biblioteca para hash de senhas
const jwt = require("jsonwebtoken"); // Biblioteca para gerenciamento de tokens JWT
const axios = require("axios"); // Biblioteca para fazer requisições HTTP
const FormData = require("form-data"); // Biblioteca para enviar dados de formulário
const jwtSecret = process.env.JWT_CODE; // Segredo para codificação de JWT

// Função para gerar um token JWT
const generateToken = ({ id }) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
};

// Função auxiliar para upload de imagem
const uploadImageToImgbb = async (fileBuffer) => {
  try {
    const formData = new FormData();
    formData.append("image", fileBuffer.toString("base64"));

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    return response.data.data.url;
  } catch (error) {
    console.error("Erro ao enviar imagem para o Imgbb:", error);
    throw new Error("Erro ao enviar imagem");
  }
};

// Registrar uma nova clínica
const registerClinica = async (req, res) => {
  const {
    nome,
    endereco,
    telefone,
    email,
    senha,
    descricao,
    horarioFuncionamento,
    tiposDeAtendimento,
  } = req.body;
  let logoImagem = null;

  try {
    // Verificar se há um arquivo de imagem na requisição
    if (req.file) {
      // Enviar a imagem para o Imgbb e obter a URL
      logoImagem = await uploadImageToImgbb(req.file.buffer);
    }

    // Verificar se a clínica já existe
    const clinicaExist = await Clinica.findOne({ email });
    if (clinicaExist) {
      return res
        .status(422)
        .json({ msg: "Já existe uma clínica com esse email" });
    }

    // Criar a nova clínica
    const clinica = await Clinica.create({
      nome,
      endereco,
      telefone,
      email,
      senha,
      descricao,
      horarioFuncionamento,
      tiposDeAtendimento,
      logoImagem,
    });

    if (!clinica) {
      return res.status(422).json({
        erros: "Houve um erro, por favor tente novamente mais tarde!",
      });
    }

    res.status(201).json({
      _id: clinica._id,
      token: generateToken({ id: clinica._id }),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Atualizar informações da clínica
const updateClinica = async (req, res) => {
  const {
    nome,
    endereco,
    telefone,
    descricao,
    horarioFuncionamento,
    tiposDeAtendimento,
  } = req.body;
  let logoImagem = null;

  try {
    // Verificar se há um arquivo de imagem na requisição
    if (req.file) {
      logoImagem = await uploadImageToImgbb(req.file.buffer);
    }

    // Obter a clínica atual da requisição
    const reqClinica = req.user;

    // Buscar a clínica no banco de dados
    const clinica = await Clinica.findById(reqClinica._id);

    if (!clinica) {
      return res.status(404).json({ error: "Clínica não encontrada" });
    }

    // Atualizar os dados da clínica
    if (nome) clinica.nome = nome;
    if (endereco) clinica.endereco = endereco;
    if (telefone) clinica.telefone = telefone;
    if (descricao) clinica.descricao = descricao;
    if (horarioFuncionamento)
      clinica.horarioFuncionamento = horarioFuncionamento;
    if (tiposDeAtendimento) clinica.tiposDeAtendimento = tiposDeAtendimento;
    if (logoImagem) clinica.logoImagem = logoImagem;

    await clinica.save();

    res.status(200).json(clinica);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Obter Clínica por ID
const getById = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar a clínica pelo ID
    const clinica = await Clinica.findById(id);
    if (clinica) {
      return res.status(200).json(clinica);
    }

    // Se não encontrar
    res.status(404).json({ errors: "Clínica não encontrada" });
  } catch (e) {
    res.status(404).json({ errors: e.message });
  }
};

module.exports = {
  registerClinica,
  updateClinica,
  getById,
};
