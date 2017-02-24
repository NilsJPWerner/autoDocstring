var example = ' def test_function(self, var1, var2, par1=1, par2 = "asdf"): ';

interface Argument {
    var: string;
    type: string;
}

interface KeywordArgument extends Argument {
    default: string;
}

interface Decorator {
    name: string;
}

interface Docstring {
    args: Argument[];
    kwargs: KeywordArgument[];
    decorators: Decorator[];
}


function parseDefinitionLines(lines: string[]) {
    if (lines.length == 0 || !/^\s*def /.test(lines[0])) {
        // if no lines were found in definition or
        // first line does not start with def
        return null
    }
    let parsedDefinition = {
        'args': parseArguments(lines[0]),
        'kwargs': parseKeywordArguments(lines[0]),
        'decorators': parseDecorators(lines.slice(1)),
    }
}

function parseArguments(line: string) {
    let args: Argument[] = [];
    let param_list = line.match(/\(\s*([^)]+?)\s*\)/);
    if (param_list == null) return args;

    for (let param of param_list[1].split(/\s*,\s*/)) {
        if (!param.includes('=') && !['self', 'cls'].some(x => param.includes(x))) {
            args.push({ var: param, type: null })
        }
    }
    return args
}

function parseKeywordArguments(line: string) {
    let kwargs: KeywordArgument[] = []
    let match: RegExpExecArray;
    while (match = /(\w+) *= *("\w+"|\w+)/g.exec(line)) {
        let kwarg: KeywordArgument = {
            var: match[1],
            default: match[2],
            type: null
        }
        kwargs.push(kwarg);
    }

}

function parseDecorators(lines: string[]) {
    let decorators: string[] = []
    for (let line of lines) {
        let match = line.match(/\s*\@(\w+)/);
        if (match == null) continue;
        decorators.push(match[1])
    }
    return decorators
}
