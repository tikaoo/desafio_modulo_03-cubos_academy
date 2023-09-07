const pool = require("../config/database");

const categories = async () => {
  const query = "SELECT * FROM categorias;";
  const categoriesFound = await pool.query(query);

  return categoriesFound.rows;
};
const getCategorieNameById = async (categoria_id) => {
  const query = `SELECT * FROM categorias WHERE id = $1;`;  
    const { rows,rowCount } = await pool.query(query, [categoria_id]);

    if (rowCount) {
      return rows[0].descricao
    }else{
      return false
    }   
 
};

module.exports = { categories, getCategorieNameById };
