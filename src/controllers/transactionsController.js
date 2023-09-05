const transactionsRepository = require("../repository/transactionsRepository");
const { categorieFoundId } = require("../repository/categoriesRepository");
const { checkRequiredFieldsTransactions } = require("../utils/utils");
const filterQueryParameters = require("../utils/query");

const listTransactions = async (req, res) => {
  try {
    const { filtro: queryParams } = req.query;
    const { id: userId } = req.loggedUser;
    const { rows: listAllTransactions } =
      await transactionsRepository.findTransactionsForId(userId);

    if (queryParams) {
      const queryResult = filterQueryParameters(queryParams, listAllTransactions);
      return res.status(200).json(queryResult);
    }

    return res.status(200).json(listAllTransactions);
  } catch (error) {
    res.status(500).json({

      mensagem: "Não foi possível listar as transações!",
    });
  }
};

const createNewTransactions = async (req, res) => {
  try {
    const { tipo, descricao, valor, data, categoria_id } = req.body;

    const invalidArgurmets = checkRequiredFieldsTransactions(req.body);

    if (invalidArgurmets) {
      return res.status(400).json(invalidArgurmets);
    }

    const { id: userId } = req.loggedUser;
    const categoria_nome = await categorieFoundId(categoria_id);

    const resultTransaction =
      await transactionsRepository.createNewTransactions(
        tipo,
        descricao,
        valor,
        data,
        userId,
        categoria_id
      );

    const resultTransactionWithCategorie = {
      ...resultTransaction,
      categoria_nome,
    };

    return res.status(201).json({ 
      ...resultTransactionWithCategorie.rows[0],
      categoria_nome: categoria_nome,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Não foi possível cadastrar a transação" });
  }
};
const deleteTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.loggedUser;

    let findTransactionsForDelete =
      await transactionsRepository.findTransactionsForIdAndUsuserId(id, userId);

    if (findTransactionsForDelete.rowCount === 0) {
      return res.status(404).json({
        mensagem: "Transação não encontrada.",
      });
    } else {
      findTransactionsForDelete =
        await transactionsRepository.findTransactionsForDelete(id, userId);
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(500).json({
      mensagem: "Não foi possível deletar a transação.",
    });
  }
};

const updateTransactionForId = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    

    const invalidArgurmets = checkRequiredFieldsTransactions(req.body);
    if (invalidArgurmets) {
      return res.status(400).json(invalidArgurmets);
    }
    const { id: userId } = req.loggedUser;
    let updatedTransaction =
      await transactionsRepository.findTransactionsForIdAndUsuserId(id, userId);

    if (updatedTransaction.rowCount === 0) {
      return res.status(404).json({
        mensagem: "Transação não encontrada.",
      });
    } else {
      updatedTransaction = await transactionsRepository.updateTransactionForId(
        descricao,
        valor,
        data,
        categoria_id,
        tipo,
        id,
        userId
      );
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(500).json({
      messagem: "Não foi possível atualizar a transação",
    });
  }
};

const detailTransactionForId = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria_nome = await categorieFoundId(id);
    const { id: userId } = req.loggedUser;
    let detailTransaction =
      await transactionsRepository.findTransactionsForIdAndUsuserId(id, userId);

    if (detailTransaction.rowCount === 0) {
      return res.status(404).json({
        mensagem: "Transação não encontrada.",
      });
    } else {
      return res.status(200).json({...detailTransaction.rows[0],categoria_nome:categoria_nome});
    }
  } catch (error) {
    res.status(500).json({
      messagem: "Não foi possível listar as transações",
    });
  }
};

const getExtractForUser = async (req, res) => {
  try {
    const { id: userId } = req.loggedUser;
    const extractFound = await transactionsRepository.getExtractForUser(userId);

    const response = {
      entrada: 0,
      saida: 0,
    };

    extractFound.rows.forEach((row) => {
      const type = row.tipo;
      const total = row.sum;
      if (type === 'entrada') {
        response.entrada += total;
      } else if (type === 'saida') {
        response.saida += total;
      }
    });   
    response.entrada = parseInt(response.entrada);
    response.saida = parseInt(response.saida);   

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      messagem: "Não foi possível listar as transações",
    });
  }
};

module.exports = {
  listTransactions,
  createNewTransactions,
  deleteTransactions,
  updateTransactionForId,
  detailTransactionForId,
  getExtractForUser,
};
