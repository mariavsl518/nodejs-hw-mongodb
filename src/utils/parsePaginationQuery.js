function parseNumber(maybeNumber, defaultValue) {

    if (typeof maybeNumber !== 'string') {
        return defaultValue
    }

    const parsedNumber = parseInt(maybeNumber);

    if (Number.isNaN(parsedNumber)) {
        return defaultValue
    }
    return parsedNumber
}


export function parsePaginationQuery(query) {

    const { page, perPage } = query;

    const parsedPage = parseNumber(page, 1)
    const parsedPerPage = parseNumber(perPage, 5)

    return {
        page: parsedPage,
        perPage: parsedPerPage
    }
}
