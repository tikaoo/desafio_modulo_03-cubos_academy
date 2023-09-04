const usersRepository = require("../repository/usersRepository");
const jwt = require("jsonwebtoken");
const { comparePassword } = require("../utils/password");
const { tokenPassword } = require("../../sensitiveData");
const { tokenValidation } = require("../utils/token");

const validateRequiredFields = (req, res, next) => {
    const { nome, email, senha } = req.body;

    const datasForRegistration = {
        nome,
        email,
        senha
    }

    const incorrectDatas = Object.values(datasForRegistration).includes(undefined);

    if (incorrectDatas) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }
    next();
}

const validateEmail = async (req, res, next) => {
    const { email } = req.body;
    const loggedUser = req.loggedUser;
    try {
        const existedEmail = await usersRepository.checkEmailAlreadyRegistered(email);
        if (existedEmail) {
            if (loggedUser) {
                if (email !== loggedUser.email) {
                    return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' });
                }
            } else {
                return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' });
            }
        }
        next();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }

}

const validateRequiredFieldsLogin = (req, res, next) => {
    const { email, senha } = req.body;

    const datasForLogin = {
        email,
        senha
    }

    const incorrectData = Object.values(datasForLogin).includes(undefined);

    if (incorrectData) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }
    next();
}

const validateLoginDatas = async (req, res, next) => {
    const loginDatas = req.body;

    const { rows: userFoundByEmail, rowCount } = await usersRepository.findUserByEmail(loginDatas.email);
    if (!rowCount) {
        return res.status(401).json({ mensagem: 'Usuário e/ou senha inválido(s).' });
    }
    const userFound = userFoundByEmail[0];
    const validPawword = await comparePassword(loginDatas.senha, userFound.senha)
    if (!validPawword) {
        return res.status(401).json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }
    next();
}

const checkUserLogin = async (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        const validUserToken = tokenValidation(token, tokenPassword);
        if (!validUserToken) {
            return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
        }
        const { rows: userDatas } = await usersRepository.findUserById(validUserToken.id);
        req.loggedUser = userDatas[0];
        next();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

module.exports = {
    validateRequiredFields,
    validateEmail,
    validateRequiredFieldsLogin,
    validateLoginDatas,
    checkUserLogin
}