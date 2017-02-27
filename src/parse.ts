import { Argument, KeywordArgument, Decorator, DocstringParts } from './interfaces';

export class FunctionParser {

    parseDefinitionLines(lines: string[]) {
        if (lines.length == 0 || !/^\s*def /.test(lines[0])) {
            // if no lines were found in definition or
            // first line does not start with def
            return null
        }
        let parsedDefinition: DocstringParts = {
            args: this.parseArguments(lines[0]),
            kwargs: this.parseKeywordArguments(lines[0]),
            decorators: this.parseDecorators(lines.slice(1)),
        }
        return parsedDefinition;
    }

    parseArguments(line: string) {
        let args: Argument[] = [];
        let regex: RegExp = /\(\s*([^)]+?)\s*\)/;
        let param_list = line.match(regex);
        if (param_list == null) return args;

        for (let param of param_list[1].split(/\s*,\s*/)) {
            if (!param.includes('=') && !['self', 'cls'].some(x => param.includes(x))) {
                args.push({
                    var: param,
                    type: null
                });
            }
        }
        return args
    }

    parseKeywordArguments(line: string) {
        let kwargs: KeywordArgument[] = []
        let match: RegExpExecArray;
        let regex: RegExp = /(\w+) *= *("\w+"|\w+)/g;
        while ((match = regex.exec(line)) != null) {
            kwargs.push({
                var: match[1],
                default: match[2],
                type: null
            });
        }
        return kwargs
    }

    parseDecorators(lines: string[]) {
        let decorators: Decorator[] = []
        for (let line of lines) {
            let match = line.match(/\s*\@(\w+)/);
            if (match == null) continue;
            decorators.push({name: match[1]});
        }
        return decorators
    }
}
