
export function guessType(parameter: string): string {
    parameter = parameter.trim()

    if (hasTypeHint(parameter)) {
        return getTypeFromTyping(parameter);
    }

    if (isKwarg(parameter)) {
        return guessTypeFromDefaultValue(parameter);
    }

    return guessTypeFromName(parameter);
}

function getTypeFromTyping(parameter: string): string {
    let pattern = /\w+\s*:\s*(\w[\w\[\], \.]*)/
    let typeHint = pattern.exec(parameter);

    if (typeHint == undefined || typeHint.length != 2) {
        return undefined
    }

    return typeHint[1].trim()
}

function guessTypeFromDefaultValue(parameter: string): string {
    let pattern = /\w+\s*(?::[\w\[\], \.]+)?=\s*(.+)/;
    let defaultValueMatch = pattern.exec(parameter);

    if (defaultValueMatch == undefined || defaultValueMatch.length != 2) {
        return undefined;
    };

    let defaultValue = defaultValueMatch[1];

    if (isInteger(defaultValue)) { return 'int' }

    if (isFloat(defaultValue)) { return 'float' }

    if (isHexadecimal(defaultValue)) { return 'hexadecimal' }

    if (isString(defaultValue)) { return 'str' }

    if (isBool(defaultValue)) { return 'bool' }

    if (isList(defaultValue)) { return 'list' }

    if (isTuple(defaultValue)) { return 'tuple' }

    if (isDict(defaultValue)) { return 'dict' }

    if (isRegexp(defaultValue)) { return 'regexp' }

    if (isUnicode(defaultValue)) { return 'unicode' }

    if (isBytes(defaultValue)) { return 'bytes' }

    if (isFunction(defaultValue)) { return 'function' }

    return undefined
}

function guessTypeFromName(parameter: string): string {
    if (parameter.startsWith('is') || parameter.startsWith('has')) {
        return 'bool'
    }

    if (inArray(parameter, ['cb', 'callback', 'done', 'next', 'fn'])) {
        return 'function'
    }

    return undefined
}

function hasTypeHint(parameter: string): boolean {
    return (parameter.match(/^\w+\s*:/) != undefined)
}

function isKwarg(parameter: string): boolean {
    return parameter.includes("=")
}

function isInteger(value: string): boolean {
    return (value.match(/^[-+]?[0-9]+$/) != undefined)
}

function isFloat(value: string): boolean {
    return (value.match(/^[-+]?[0-9]*\.[0-9]+$/) != undefined)
}

function isHexadecimal(value: string): boolean {
    return (value.match(/^[-+]?0x[0-9abcdef]+/) != undefined)
}

function isString(value: string): boolean {
    return (value.match(/^\".*\"$|^\'.*\'$/) != undefined)
}

function isBool(value: string): boolean {
    return (value.match(/^True$|^False$/) != undefined)
}

function isList(value: string): boolean {
    return (value.match(/^\[.*\]$/) != undefined)
}

function isTuple(value: string): boolean {
    return (value.match(/^\(.*\)$/) != undefined)
}

function isDict(value: string): boolean {
    return (value.match(/^\{.*\}$/) != undefined)
}

function isRegexp(value: string): boolean {
    return (value.match(/^[rR]/) != undefined && isString(value.substr(1)))
}

function isUnicode(value: string): boolean {
    return (value.match(/^[uU]/) != undefined && isString(value.substr(1)))
}

function isBytes(value: string): boolean {
    return (value.match(/^[bB]/) != undefined && isString(value.substr(1)))
}

function isFunction(value: string): boolean {
    return (value.match(/^lambda /) != undefined)
}

export function inArray<type>(item: type, array: type[]) {
    return array.some(x => item == x);
}
