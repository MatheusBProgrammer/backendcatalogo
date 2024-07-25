// Imports
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const FormData = require("form-data");
const jwtSecret = process.env.JWT_CODE;

// Token generate
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

// Register
const register = async (req, res) => {
  const { name, email, password, bio } = req.body;
  let profileImage = null;

  try {
    // Verificar se há um arquivo de imagem na requisição
    if (req.file) {
      // Se sim, enviar a imagem para o Imgbb e obter a URL
      profileImage = await uploadImageToImgbb(req.file.buffer);
    }

    // Verificar se o usuário já existe
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(422)
        .json({ msg: "Já existe um usuário com esse email" });
    }

    // Gerar o hash da senha
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Criar o usuário
    const user = await User.create({
      name,
      email,
      password: passwordHash,
      profileImage,
      bio,
    });

    if (!user) {
      return res.status(422).json({
        erros: "Houve um erro, por favor tente novamente mais tarde!",
      });
    }

    res.status(201).json({
      _id: user._id,
      token: generateToken({ id: user._id }),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Verificar se o usuário existe
    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado"] });
    }

    // Verificar se a senha está correta
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(404).json({ errors: ["Senha inválida"] });
    }

    // Retornar usuário e token
    res.status(200).json({
      _id: user._id,
      profileImage: user.profileImage,
      token: generateToken({ id: user._id }),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Get Current User
const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

// Update User
const updateUser = async (req, res) => {
  const { name, password, bio } = req.body;
  let profileImage = null;

  try {
    // Verificar se há um arquivo de imagem na requisição
    if (req.file) {
      profileImage = await uploadImageToImgbb(req.file.buffer);
    }

    // Obter o usuário atual da requisição
    const reqUser = req.user;

    // Buscar o usuário no banco de dados
    const user = await User.findById(reqUser._id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Atualizar o usuário
    if (name) user.name = name;
    if (password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);
    }
    if (profileImage) user.profileImage = profileImage;
    if (bio) user.bio = bio;

    await user.save();

    res.status(200).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Get User By ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ errors: "Usuário não encontrado" });
    }

    res.status(200).json(user);
  } catch (e) {
    res.status(404).json({ errors: e.message });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateUser,
  getUserById,
};
