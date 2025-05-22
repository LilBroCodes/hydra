export class At {
    static ofString(s: string): BaseAt | null {
        const baseMatch =  s.match(BaseAt.REGEX);

        if (baseMatch) {
            return new BaseAt(baseMatch[1], parseInt(baseMatch[2]), parseInt(baseMatch[3]));
        }

        return null;
    }
}

export class BaseAt {
    static REGEX = /@At\("([^"]*)"(?:\s*,\s*offset\s*=\s*\(\s*(\d+)\s*,\s*(\d+)\s*\))?\)/;
    where: string;
    offset: {line: number, column: number};

    constructor(where: string, line?: number, column?: number) {
        this.where = where;
        this.offset = {
            line: line || 0,
            column: column || 0
        }
    }

    hasOffset() {
        return this.offset.line != 0 || this.offset.column != 0;
    }    
}