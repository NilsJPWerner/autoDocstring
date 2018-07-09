import { indentationOf, blankLine } from './utilities'

export function isMultiLineString(document: string, linePosition: number, charPosition: number, quoteStyle: string): boolean {    
    let lines = document.split('\n')
    let linePrecedingPosition = lines[linePosition].slice(0, charPosition - 3)

    linePrecedingPosition.replace(quoteStyle, '')

    if (blankLine(linePrecedingPosition)) {
        return false
    }

    return true;
}
