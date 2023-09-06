const filterQueryParameters = (query, consultationList) => {
    const standardizedQuery = query.map(query => query.toLowerCase());
    const filteringResult = consultationList.filter(transaction => {
        const standardizedCategory = transaction.categoria_nome.toLowerCase();
        return standardizedQuery.includes(standardizedCategory);
    });
    return filteringResult;
}

module.exports = filterQueryParameters;