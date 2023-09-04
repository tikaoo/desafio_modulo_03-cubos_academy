const usersRepository = require("../repository/usersRepository");
const { tokenPassword } = require("../../sensitiveData");
const { createToken } = require("../utils/token");

const registerNewUser = async (req, res) => {
    const newUserDatas = req.body;
    try {
        const { rows: newUserRegistration } = await usersRepository.createNewUser(newUserDatas);
        const usersInfo = newUserRegistration[0];
        return res.status(201).json(usersInfo);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

const login = async (req, res) => {
    const loginDatas = req.body;
    try {
        const { rows: userFound } = await usersRepository.findUserByEmail(loginDatas.email);
        const userInfos = userFound[0];
        const token = createToken({ id: userInfos.id }, tokenPassword, { expiresIn: '8h' });

        return res.status(200).json({
            usuario: {
                id: userInfos.id,
                nome: userInfos.nome,
                email: userInfos.email
            },
            token
        });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

const updateUser = async (req, res) => {
    const { id: idUser } = req.loggedUser;
    const newDatasUser = req.body;
    try {
        await usersRepository.updateDatasUser(idUser, newDatasUser);
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

const detailUser = (req, res) => {
    const userDatas = req.loggedUser;
    try {
        return res.status(200).json({
            id: userDatas.id,
            nome: userDatas.nome,
            email: userDatas.email,
        });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}

module.exports = {
    registerNewUser,
    login,
    updateUser,
    detailUser
}