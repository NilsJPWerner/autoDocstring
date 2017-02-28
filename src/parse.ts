import { Argument, KeywordArgument, Decorator, Returns, DocstringParts } from './interfaces';

export class FunctionParser {

    // Need to work on:
    //      regex for tuple input & strings with commas
    //      Guess type
    //      Move the regex def test higher in the call stack

    parseLines(def_lines: string[], content_lines: string[]) {
        if (def_lines.length == 0 || !/^\s*def /.test(def_lines[0])) {
            // if no lines were found in definition or
            // first line does not start with def
            return null
        }
        let parsedLines: DocstringParts = {
            args: this.parseArguments(def_lines[0]),
            kwargs: this.parseKeywordArguments(def_lines[0]),
            decorators: this.parseDecorators(def_lines.slice(1)),
            returns: this.parseReturns(content_lines)
        }

        return parsedLines

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

    parseReturns(lines: string[]) {
        for (let line of lines) {
            let match = /\s*(return|yield)\s+([\w"]+)/.exec(line);
            if (match != null) {
                let v: Returns = {
                    return_type: (match[1] == "return") ? "Returns" : "Yields",
                    value_type: match[2]
                };
                return v;
            }
            return null;
        }
    }
}
