
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

    if (typeHint == null || typeHint.length != 2) {
        return 'type'
    }

    return typeHint[1].trim()
}

function guessTypeFromDefaultValue(parameter: string): string {
    let pattern = /\w+\s*(?::[\w\[\], \.]+)?=\s*(.+)/;
    let defaultValueMatch = pattern.exec(parameter);

    if (defaultValueMatch == null || defaultValueMatch.length != 2) {
        return 'type';
    };

    let defaultValue = defaultValueMatch[1];

    if (isInteger(defaultValue)) { return 'int' }

    if (isFloat(defaultValue)) { return 'float' }

    if (isString(defaultValue)) { return 'str' }

    if (isBool(defaultValue)) { return 'bool' }

    if (isList(defaultValue)) { return 'list' }

    if (isTuple(defaultValue)) { return 'tuple' }

    if (isDict(defaultValue)) { return 'dict' }

    if (isRegexp(defaultValue)) { return 'regexp' }

    if (isUnicode(defaultValue)) { return 'unicode' }

    if (isBytes(defaultValue)) { return 'bytes' }

    if (isFunction(defaultValue)) { return 'function' }

    return 'type'
}

function guessTypeFromName(parameter: string): string {
    if (parameter.startsWith('is') || parameter.startsWith('has')) {
        return 'bool'
    }

    if (inArray(parameter, ['cb', 'callback', 'done', 'next', 'fn'])) {
        return 'function'
    }

    return 'type'
}

function hasTypeHint(parameter: string): boolean {
    return (parameter.match(/^\w+\s*:/) != null)
}

function isKwarg(parameter: string): boolean {
    return parameter.includes("=")
}

function isInteger(value: string): boolean {
    return (value.match(/^[-+]?[0-9]+$/) != null)
}

function isFloat(value: string): boolean {
    return (value.match(/^[-+]?[0-9]*\.[0-9]+$/) != null)
}

function isString(value: string): boolean {
    return (value.match(/^\".*\"$|^\'.*\'$/) != null)
}

function isBool(value: string): boolean {
    return (value.match(/^True$|^False$/) != null)
}

function isList(value: string): boolean {
    return (value.match(/^\[.*\]$/) != null)
}

function isTuple(value: string): boolean {
    return (value.match(/^\(.*\)$/) != null)
}

function isDict(value: string): boolean {
    return (value.match(/^\{.*\}$/) != null)
}

function isRegexp(value: string): boolean {
    return (value.match(/^[rR]/) != null && isString(value.substr(1)))
}

function isUnicode(value: string): boolean {
    return (value.match(/^[uU]/) != null && isString(value.substr(1)))
}

function isBytes(value: string): boolean {
    return (value.match(/^[bB]/) != null && isString(value.substr(1)))
}

function isFunction(value: string): boolean {
    return (value.match(/^lambda /) != null)
}

export function inArray<type>(item: type, array: type[]) {
    return array.some(x => item == x);
}
