function parseType(maybeType) {
    if (typeof maybeType !== 'string') {
        return undefined
    }
    const keys = ['home', 'work', 'personal']
    if (keys.includes(maybeType)) {
        return maybeType
    }
    return undefined
}

function parseIsFavourite(maybeFavourite) {
    if (maybeFavourite !== 'true' && maybeFavourite !== 'false') {
        return undefined
    }
    return maybeFavourite
}

export function parseFilterParams(query) {
    const { type, isFavourite } = query

    const parsedType = parseType(type)
    const parsedIsFavourie = parseIsFavourite(isFavourite)

    return {
        type: parsedType,
        isFavourite: parsedIsFavourie
    }

}
