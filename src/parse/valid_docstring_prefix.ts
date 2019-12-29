/**
 * Checks whether the 3 characters proceeding the position are the correct start
 * to a docstring and that there are no other characters on the line.
 */
export function validDocstringPrefix(document: string, linePosition: number,
                                     charPosition: number, quoteStyle: string): boolean {
    const lines = document.split("\n");
    const line = lines[linePosition];
    const prefix = line.slice(0, charPosition + 1);

    const regex =  RegExp("^\\s*" + quoteStyle + "$");

    return  regex.test(line) && regex.test(prefix);
}
