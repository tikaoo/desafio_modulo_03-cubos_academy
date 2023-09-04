const { tokenPassword } = require("../../sensitiveData");
const jwt = require("jsonwebtoken");

const createToken = (payload, secretPrivateKey, options) => {
    const token = jwt.sign(payload, secretPrivateKey, options);
    return token;
}

const tokenValidation = (userToken, tokenPassword) => {
    const validation = jwt.verify(userToken, tokenPassword, function (err, res) {
        if (err) {
            return false;
        } else {
            return res;
        }
    });
    return validation;
}

module.exports = {
    tokenValidation,
    createToken
}