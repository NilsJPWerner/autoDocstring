export function guessType(parameter: string): string {
    parameter = parameter.trim();

    if (hasTypeHint(parameter)) {
        return getTypeFromTypeHint(parameter);
    }

    if (isKwarg(parameter)) {
        return guessTypeFromDefaultValue(parameter);
    }

    return guessTypeFromName(parameter);
}

function getTypeFromTypeHint(parameter: string): string {
    const sections = parameter.split(":");
    if (sections.length !== 2) {
        return undefined;
    }
    const typeHint = sections[1];

    const pattern = /\s*(['"]?[^=]+['"]?)\s*(=.*)?/;
    const typeHintRegex = pattern.exec(typeHint);

    if (typeHintRegex == null) {
        return undefined;
    }

    // Remove enclosing quotes
    let type = typeHintRegex[1].trim();
    type = type.replace(/^['"]|['"]$/g, "");

    return type;
}

function guessTypeFromDefaultValue(parameter: string): string {
    const pattern = /\w+\s*(?::[\w\[\], \.]+)?=\s*(.+)/;
    const defaultValueMatch = pattern.exec(parameter);

    if (defaultValueMatch == null || defaultValueMatch.length !== 2) {
        return undefined;
    }

    const defaultValue = defaultValueMatch[1];

    if (isInteger(defaultValue)) {
        return "int";
    }

    if (isFloat(defaultValue)) {
        return "float";
    }

    if (isHexadecimal(defaultValue)) {
        return "hexadecimal";
    }

    if (isString(defaultValue)) {
        return "str";
    }

    if (isBool(defaultValue)) {
        return "bool";
    }

    if (isList(defaultValue)) {
        return "list";
    }

    if (isTuple(defaultValue)) {
        return "tuple";
    }

    if (isDict(defaultValue)) {
        return "dict";
    }

    if (isRegexp(defaultValue)) {
        return "regexp";
    }

    if (isUnicode(defaultValue)) {
        return "unicode";
    }

    if (isBytes(defaultValue)) {
        return "bytes";
    }

    if (isFunction(defaultValue)) {
        return "function";
    }

    return undefined;
}

function guessTypeFromName(parameter: string): string {
    if (parameter.startsWith("is") || parameter.startsWith("has")) {
        return "bool";
    }

    if (inArray(parameter, ["cb", "callback", "done", "next", "fn"])) {
        return "function";
    }

    return undefined;
}

function hasTypeHint(parameter: string): boolean {
    const pattern = /^\w+\s*:/;
    return pattern.test(parameter);
}

function isKwarg(parameter: string): boolean {
    return parameter.includes("=");
}

function isInteger(value: string): boolean {
    const pattern = /^[-+]?[0-9]+$/;
    return pattern.test(value);
}

function isFloat(value: string): boolean {
    const pattern = /^[-+]?[0-9]*\.[0-9]+$/;
    return pattern.test(value);
}

function isHexadecimal(value: string): boolean {
    const pattern = /^[-+]?0x[0-9abcdef]+/;
    return pattern.test(value);
}

function isString(value: string): boolean {
    const pattern = /^\".*\"$|^\'.*\'$/;
    return pattern.test(value);
}

function isBool(value: string): boolean {
    const pattern = /^True$|^False$/;
    return pattern.test(value);
}

function isList(value: string): boolean {
    const pattern = /^\[.*\]$/;
    return pattern.test(value);
}

function isTuple(value: string): boolean {
    const pattern = /^\(.*\)$/;
    return pattern.test(value);
}

function isDict(value: string): boolean {
    const pattern = /^\{.*\}$/;
    return pattern.test(value);
}

function isRegexp(value: string): boolean {
    const pattern = /^[rR]/;
    return pattern.test(value) && isString(value.substr(1));
}

function isUnicode(value: string): boolean {
    const pattern = /^[uU]/;
    return pattern.test(value) && isString(value.substr(1));
}

function isBytes(value: string): boolean {
    const pattern = /^[bB]/;
    return pattern.test(value) && isString(value.substr(1));
}

function isFunction(value: string): boolean {
    const pattern = /^lambda /;
    return pattern.test(value);
}

export function inArray<type>(item: type, array: type[]) {
    return array.some((x) => item === x);
}
