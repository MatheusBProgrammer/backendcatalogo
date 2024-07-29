const Profissional = require("../models/Profissional"); // Modelo para Profissional
const axios = require("axios"); // Biblioteca para fazer requisições HTTP
const FormData = require("form-data"); // Biblioteca para enviar dados de formulário

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

// Registrar um novo profissional
const registerProfissional = async (req, res) => {
  const {
    nomeCompleto,
    especialidade,
    numeroRegistro,
    instituicaoEnsino,
    cep,
    estado,
    cidade,
    bairro,
    numero,
    rua,
    telefone,
    email,
    senha,
    descricaoPessoal,
    horarioAtendimento,
  } = req.body;
  let perfilImagem = null;

  try {
    // Verificar se há um arquivo de imagem na requisição
    if (req.file) {
      // Enviar a imagem para o Imgbb e obter a URL
      perfilImagem = await uploadImageToImgbb(req.file.buffer);
    }

    // Verificar se o profissional já existe
    const profissionalExist = await Profissional.findOne({ email });
    if (profissionalExist) {
      return res
        .status(422)
        .json({ msg: "Já existe um profissional com esse email" });
    }

    // Criar o objeto endereco
    const endereco = {
      cep,
      estado,
      cidade,
      bairro,
      numero,
      rua,
    };

    // Criar o novo profissional
    const profissional = await Profissional.create({
      nomeCompleto,
      especialidade,
      numeroRegistro,
      instituicaoEnsino,
      endereco, // Salvando o objeto endereço diretamente
      telefone,
      email,
      senha,
      descricaoPessoal,
      horarioAtendimento,
      perfilImagem,
    });

    if (!profissional) {
      return res.status(422).json({
        erros: "Houve um erro, por favor tente novamente mais tarde!",
      });
    }

    res.status(201).json(profissional);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Atualizar informações do profissional
const updateProfissional = async (req, res) => {
  const {
    nomeCompleto,
    especialidade,
    instituicaoEnsino,
    endereco,
    telefone,
    descricaoPessoal,
    horarioAtendimento,
  } = req.body;
  let perfilImagem = null;

  try {
    // Verificar se há um arquivo de imagem na requisição
    if (req.file) {
      perfilImagem = await uploadImageToImgbb(req.file.buffer);
    }

    // Obter o profissional atual da requisição
    const reqProfissional = req.user;

    // Buscar o profissional no banco de dados
    const profissional = await Profissional.findById(reqProfissional._id);

    if (!profissional) {
      return res.status(404).json({ error: "Profissional não encontrado" });
    }

    // Atualizar os dados do profissional
    if (nomeCompleto) profissional.nomeCompleto = nomeCompleto;
    if (especialidade) profissional.especialidade = especialidade;
    if (instituicaoEnsino) profissional.instituicaoEnsino = instituicaoEnsino;
    if (endereco) profissional.endereco = endereco;
    if (telefone) profissional.telefone = telefone;
    if (descricaoPessoal) profissional.descricaoPessoal = descricaoPessoal;
    if (horarioAtendimento)
      profissional.horarioAtendimento = horarioAtendimento;
    if (perfilImagem) profissional.perfilImagem = perfilImagem;

    await profissional.save();

    res.status(200).json(profissional);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Obter Profissional por ID
const getProfissionalById = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar o profissional pelo ID
    const profissional = await Profissional.findById(id);
    if (profissional) {
      return res.status(200).json(profissional);
    }

    // Se não encontrar
    res.status(404).json({ errors: "Profissional não encontrado" });
  } catch (e) {
    res.status(404).json({ errors: e.message });
  }
};

module.exports = {
  registerProfissional,
  updateProfissional,
  getProfissionalById,
};
