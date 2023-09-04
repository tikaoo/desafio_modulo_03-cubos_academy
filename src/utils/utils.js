const checkRequiredFieldsTransactions = (fields) => {
  if (!fields.tipo) {
    return {
      mensagem: "É necessário preencher o campo tipo",
    };
  }

  if (fields.tipo !== "entrada" && fields.tipo !== "saida") {
    return {
      messagem: "O tipo informado deve ser entrada ou saída",
    };
  }

  if (!fields.descricao) {
    return {
      mensagem: "É necessário preencher o campo descrição.",
    };
  }

  if (!fields.valor) {
    return {
      mensagem: "É necessário preencher o campo valor",
    };
  }
  if(fields.valor <= 0){
    return {
      mensagem: "Valor precisa ser maior que zero!",
    };
  }

  if (!fields.data) {
    return {
      mensagem: "É necessário preencher o campo data.",
    };
  }

  if (!fields.categoria_id) {
    return {
      mensagem: "É necessário preencher o campo categoria_id",
    };
  }
};

module.exports = { checkRequiredFieldsTransactions };
