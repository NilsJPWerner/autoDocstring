
export function inArray<type>(item: type, array: type[]) {
    return array.some(x => item == x);
}

export function includesFromArray(string: string, substrings: string[]) {
    substrings.some(x => string.includes(x))
}
