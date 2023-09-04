const categoriesRepository = require("../repository/categoriesRepository");

const listCategories = async (req, res) => {
  try {
    const listAll = await categoriesRepository.categories();

    return res.status(200).json(listAll);
  } catch (error) {
    res.status(500).json({
      mensagem: "Não foi possível listar as categorias",
    });
  }
};

module.exports = {
  listCategories,
};
