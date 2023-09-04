const pool = require("../config/database");

const categories = async () => {
  const query = "SELECT * FROM categorias;";
  const categoriesFound = await pool.query(query);

  return categoriesFound.rows;
};
const categorieFoundId = async (categorie_id) => {
  const query = `SELECT descricao FROM categorias WHERE id = $1;`;

  const { rows, rowCount } = await pool.query(query, [categorie_id]);

  if (rowCount === 0) {
    return {
      mensagem: "Não existe categoria cadastrada com esse id.",
    };
  }

  const categoria_nome = rows[0].descricao;

  return categoria_nome;
};

module.exports = { categories, categorieFoundId };
