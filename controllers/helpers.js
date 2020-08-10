exports.sortParse = (sortTerm) => {
    let sort = {};
    const sortParsed = sortTerm.split('::');
    sort[sortParsed[0]] = sortParsed[1] === 'asc' ? 1 : -1;
    return sort;
};

exports.filterParse = (filterTerm) => {
    let filter = {};
    const filterParsed = filterTerm.split('::');
    filter[filterParsed[0]] = filterParsed[1];
    return filter;
};
