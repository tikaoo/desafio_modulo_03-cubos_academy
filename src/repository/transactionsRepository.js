const pool = require("../config/database");

const findTransactionsForId = async (user_id) => {
  const query = `
    SELECT
      t.id,
      t.tipo,
      t.descricao,
      t.valor,
      t.data,
      t.usuario_id,
      t.categoria_id,   
      c.descricao AS categoria_nome
    FROM
      transacoes t
    INNER JOIN
      categorias c ON t.categoria_id = c.id
    WHERE
      t.usuario_id = $1;
  `;
  const transactionsFound = await pool.query(query, [user_id]);

  return transactionsFound;
};
const createNewTransactions = async (
  tipo,
  descricao,
  valor,
  data,
  usuario_id,
  categoria_id
) => {
  const query = `INSERT INTO transacoes (tipo, descricao, valor, data, usuario_id, categoria_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, tipo, descricao, valor, data, usuario_id, categoria_id`;

  const transactions = await pool.query(query, [
    tipo,
    descricao,
    valor,
    data,
    usuario_id,
    categoria_id,
  ]);

  return transactions;
};

const findTransactionsForIdAndUsuserId = async (id, user_id) => {
  const query = `SELECT * FROM transacoes WHERE id =$1 AND usuario_id =$2`;

  const transactionsFound = await pool.query(query, [id, user_id]);

  return transactionsFound;
};

const findTransactionsForDelete = async (id, user_id) => {
  const query = `DELETE FROM transacoes 
  WHERE id = $1 AND usuario_id = $2 `;

  const transactionsDelete = await pool.query(query, [id, user_id]);

  return transactionsDelete;
};

const updateTransactionForId = async (
  descricao,
  valor,
  data,
  categoria_id,
  tipo,
  id,
  usuario_id
) => {
  const query = `UPDATE transacoes 
SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 
WHERE id = $6 AND usuario_id = $7`;

  const updateTransaction = await pool.query(query, [
    descricao,
    valor,
    data,
    categoria_id,
    tipo,
    id,
    usuario_id,
  ]);

  return updateTransaction;
};
const detailTransaction = async (id, user_id) => {
  const query = `SELECT
  t.id,
  t.tipo,
  t.descricao,
  t.valor,
  t.data,
  t.usuario_id,
  t.categoria_id,   
  c.descricao AS categoria_nome
FROM
  transacoes t
LEFT JOIN
  categorias c ON t.categoria_id = c.id
WHERE t.id = $1 AND t.usuario_id = $2 returning *;`;

  const detailTransactionsFound = await pool.query(query, [id, user_id]);

  return detailTransactionsFound;
};

const getExtractForUser = async (user_id) => {
  const query = ` SELECT tipo, SUM(valor) 
  FROM transacoes
  WHERE usuario_id = $1
  GROUP BY tipo;
  `;

  const extractFound = await pool.query(query, [user_id]);

  return extractFound;
};
module.exports = {
  findTransactionsForId,
  createNewTransactions,
  findTransactionsForIdAndUsuserId,
  findTransactionsForDelete,
  updateTransactionForId,
  detailTransaction,
  getExtractForUser,
};
