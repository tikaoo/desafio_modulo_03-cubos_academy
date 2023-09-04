const bcrypt = require('bcrypt');

const encryptedPassword = (userPassword) => {
    const password = bcrypt.hash(userPassword, 10);
    return password;
}

const comparePassword = (password, encryptedPassword) => {
    return bcrypt.compare(password, encryptedPassword);
}
module.exports = {
    encryptedPassword,
    comparePassword
}