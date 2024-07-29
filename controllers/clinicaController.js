// controllers/clinicaController.js

// Importa os módulos necessários
const Clinica = require("../models/Clinica"); // Modelo para Clínica
const bcrypt = require("bcryptjs"); // Biblioteca para hash de senhas
const jwt = require("jsonwebtoken"); // Biblioteca para gerenciamento de tokens JWT
const axios = require("axios"); // Biblioteca para fazer requisições HTTP
const FormData = require("form-data"); // Biblioteca para enviar dados de formulário

// Segredo para codificação de JWT, armazenado nas variáveis de ambiente
const jwtSecret = process.env.JWT_CODE;

// Função para gerar um token JWT com base no ID
const generateToken = ({ id }) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
};

// Função auxiliar para upload de imagem para o Imgbb
const uploadImageToImgbb = async (fileBuffer) => {
  try {
    const formData = new FormData();
    // Adiciona o arquivo de imagem ao FormData
    formData.append("image", fileBuffer, { filename: "image.jpg" });

    // Faz uma requisição POST para o Imgbb com o FormData
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(), // Inclui os cabeçalhos necessários para o envio
        },
      }
    );

    // Retorna a URL da imagem enviada
    return response.data.data.url;
  } catch (error) {
    // Em caso de erro, exibe uma mensagem e lança uma exceção
    console.error("Erro ao enviar imagem para o Imgbb:", error);
    throw new Error("Erro ao enviar imagem");
  }
};

// Registrar uma nova clínica
const registerClinica = async (req, res) => {
  // Extrai os dados do corpo da requisição
  const {
    nome,
    cep,
    estado,
    cidade,
    bairro,
    numero,
    rua,
    telefone,
    email,
    senha,
    descricao,
    tiposDeAtendimento,
  } = req.body;

  // Verifica se os campos obrigatórios estão presentes
  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ error: "Nome, email e senha são obrigatórios." });
  }

  let logoImagem = null;

  try {
    // Se houver um arquivo de imagem na requisição, faz o upload para o Imgbb
    if (req.file) {
      logoImagem = await uploadImageToImgbb(req.file.buffer);
    }

    // Verifica se já existe uma clínica com o mesmo email
    const clinicaExist = await Clinica.findOne({ email });
    if (clinicaExist) {
      return res
        .status(422)
        .json({ msg: "Já existe uma clínica com esse email" });
    }

    // Hash a senha antes de salvar no banco de dados
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria o objeto endereço
    const endereco = {
      cep,
      estado,
      cidade,
      bairro,
      numero,
      rua,
    };

    // Cria uma nova clínica no banco de dados
    const clinica = await Clinica.create({
      nome,
      endereco,
      telefone,
      email,
      senha: hashedPassword,
      descricao,
      tiposDeAtendimento,
      logoImagem,
    });

    // Verifica se a clínica foi criada com sucesso
    if (!clinica) {
      return res.status(422).json({
        erros: "Houve um erro, por favor tente novamente mais tarde!",
      });
    }

    // Responde com os dados da clínica e um token JWT
    res.status(201).json({
      _id: clinica._id,
      token: generateToken({ id: clinica._id }),
    });
  } catch (e) {
    // Em caso de erro, responde com a mensagem de erro
    res.status(500).json({ error: e.message });
  }
};

// Atualizar informações da clínica
const updateClinica = async (req, res) => {
  // Extrai os dados do corpo da requisição
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
    // Se houver um arquivo de imagem na requisição, faz o upload para o Imgbb
    if (req.file) {
      logoImagem = await uploadImageToImgbb(req.file.buffer);
    }

    // Obtém a clínica atual da requisição (usuário autenticado)
    const reqClinica = req.user;

    // Busca a clínica no banco de dados
    const clinica = await Clinica.findById(reqClinica._id);

    // Verifica se a clínica foi encontrada
    if (!clinica) {
      return res.status(404).json({ error: "Clínica não encontrada" });
    }

    // Atualiza os dados da clínica com os novos valores fornecidos
    if (nome) clinica.nome = nome;
    if (endereco) clinica.endereco = endereco;
    if (telefone) clinica.telefone = telefone;
    if (descricao) clinica.descricao = descricao;
    if (horarioFuncionamento)
      clinica.horarioFuncionamento = horarioFuncionamento;
    if (tiposDeAtendimento) clinica.tiposDeAtendimento = tiposDeAtendimento;
    if (logoImagem) clinica.logoImagem = logoImagem;

    // Salva as alterações no banco de dados
    await clinica.save();

    // Responde com os dados atualizados da clínica
    res.status(200).json(clinica);
  } catch (e) {
    // Em caso de erro, responde com a mensagem de erro
    res.status(400).json({ error: e.message });
  }
};

// Obter Clínica por ID
const getById = async (req, res) => {
  // Extrai o ID da requisição
  const { id } = req.params;

  try {
    // Busca a clínica pelo ID
    const clinica = await Clinica.findById(id);
    if (clinica) {
      return res.status(200).json(clinica);
    }

    // Se a clínica não for encontrada, responde com uma mensagem de erro
    res.status(404).json({ errors: "Clínica não encontrada" });
  } catch (e) {
    // Em caso de erro, responde com a mensagem de erro
    res.status(404).json({ errors: e.message });
  }
};

// Exporta as funções do controller para uso em outras partes da aplicação
module.exports = {
  registerClinica,
  updateClinica,
  getById,
};
