import { inArray } from '../utils'


export function guessType(parameter: string): string {
    if (hasTypeHint(parameter)) {
        return getTypeFromTyping(parameter);
    }

    if (isKwarg(parameter)) {
        return guessTypeFromDefaultValue(parameter);
    }

    return guessTypeFromName(parameter);
}

function getTypeFromTyping(parameter: string): string {
    let pattern = /\w+:( ?\w[\w\[\], \.]*)/
    let typeHint = pattern.exec(parameter);

    if (typeHint == null || typeHint.length != 2) {
        return 'type'
    }

    return typeHint[1]
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
    return (parameter.match(/^\w+:[\w\[\], \.]+/) != null)
}

function isKwarg(parameter: string): boolean {
    return (parameter.match(/^\w+\s*(:[\w\[\], \.]+)?=.+$/) != null)
}

function isInteger(value: string): boolean {
    return (value.match(/^[-+]?[0-9]+$/) != null)
}

function isFloat(value: string): boolean {
    return (value.match(/^[-+]?[0-9]*\.[0-9]+$/) != null)
}

function isString(value: string): boolean {
    return (value.match(/^(\".*\"|\'.*\')$/) != null)
}

function isBool(value: string): boolean {
    return (value.match(/^(True|False)$/) != null)
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
    return (value.match(/^(r|R)$/) != null  && isString(value.substr(1)))
}

function isUnicode(value: string): boolean {
    return (value.match(/^(u|U)$/) != null  && isString(value.substr(1)))
}

function isBytes(value: string): boolean {
    return (value.match(/^(b|B)$/) != null  && isString(value.substr(1)))
}

function isFunction(value: string): boolean {
    return (value.match(/^lambda /) != null)
}
