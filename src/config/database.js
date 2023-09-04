const { userDb, hostDb, databaseDb, passwordDb, portDb } = require('../../sensitiveData');
const { Pool } = require('pg');

const databaseConnection = new Pool({
    user: userDb,
    host: hostDb,
    database: databaseDb,
    password: passwordDb,
    port: portDb
});

module.exports = databaseConnection;