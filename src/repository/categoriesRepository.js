const pool = require("../config/database");

const categories = async () => {
  const query = "SELECT * FROM categorias;";
  const categoriesFound = await pool.query(query);

  return categoriesFound.rows;
};

const checkRegisteredCategorie = async (categorie_id) => {
  const { rowCount } = await pool.query('SELECT * FROM categorias WHERE id = $1', [categorie_id]);
  if (rowCount) {
    return true;    
    };
  return false;
}



const getCategorieNameById = async (categorie_id) => {
  const query = `SELECT descricao FROM categorias WHERE id = $1;`;
  const { rows } = await pool.query(query, [categorie_id]);
  const categorie_name = rows[0].descricao;
  return categorie_name;
};

module.exports = { categories, getCategorieNameById, checkRegisteredCategorie };
