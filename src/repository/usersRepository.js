const utilsPassword = require("../utils/password");
const dataBaseConnection = require("../config/database");

const createNewUser = async (newUserDatas) => {
    const { nome, email, senha } = newUserDatas;
    const encryptedUserPassword = await utilsPassword.encryptedPassword(senha);
    const insertQuery = `INSERT INTO usuarios (nome, email, senha)
                         VALUES ($1, $2, $3) RETURNING id, nome, email`;
    const insertNewUser = dataBaseConnection.query(insertQuery, [nome, email, encryptedUserPassword]);
    return insertNewUser;
}

const checkEmailAlreadyRegistered = async (email) => {
    const { rowCount: emailFound } = await dataBaseConnection.query('SELECT email FROM usuarios WHERE email = $1', [email]);
    if (emailFound) {
        return true;
    }
    return false;
}

const findUserByEmail = (email) => {
    const userFound = dataBaseConnection.query('SELECT id, nome, email, senha FROM usuarios WHERE email = $1; ', [email]);
    return userFound;
}

const findUserById = (id) => {
    const userFound = dataBaseConnection.query('SELECT id, nome, email FROM usuarios WHERE id = $1; ', [id]);
    return userFound;
}

const updateUserDatas = async (id, newDatasUser) => {
    const encryptedPassword = await utilsPassword.encryptedPassword(newDatasUser.senha);
    const updateUserQuery = `UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4`;
    const params = [newDatasUser.nome, newDatasUser.email, encryptedPassword, id];
    const update = dataBaseConnection.query(updateUserQuery, params);
    return update;
}

module.exports = {
    createNewUser,
    checkEmailAlreadyRegistered,
    findUserByEmail,
    findUserById,
    updateUserDatas
}