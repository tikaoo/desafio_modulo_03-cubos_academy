const express = require("express");
const { registerNewUser, login, updateUser, detailUser } = require("../controllers/usersController");
const { listCategories } = require("../controllers/categoriesController");
const {
  validateRequiredFields,
  validateRequiredFieldsLogin,
  validateLoginDatas,
  checkUserLogin,
  validateEmail,
} = require("../middlewares/usersMiddleware");
const {
  listTransactions,
  createNewTransactions,
  deleteTransactions,
  updateTransactionForId,
  detailTransactionForId,
  getExtractForUser
} = require("../controllers/transactionsController");
const routes = express();

routes.post('/usuario', validateRequiredFields, validateEmail, registerNewUser);
routes.post('/login', validateRequiredFieldsLogin, validateLoginDatas, login);
routes.use(checkUserLogin);
routes.get('/usuario', detailUser);
routes.put('/usuario', validateRequiredFields, validateEmail, updateUser);

routes.get("/categoria", listCategories);

routes.get("/transacao", listTransactions);
routes.post("/transacao", createNewTransactions);
routes.delete("/transacao/:id", deleteTransactions);
routes.put("/transacao/:id", updateTransactionForId);
routes.get("/transacao/extrato", getExtractForUser);
routes.get("/transacao/:id", detailTransactionForId);

module.exports = routes;
