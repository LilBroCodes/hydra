export class At {
    static ofString(s: string): BaseAt | ExtendedAt | null {
        const baseMatch =  s.match(BaseAt.REGEX);
        const extMatch =  s.match(ExtendedAt.REGEX);

        if (baseMatch) {
            return new BaseAt(baseMatch[1]);
        } else if (extMatch) {
            return new ExtendedAt(extMatch[1], parseInt(extMatch[2]));
        }

        return null;
    }
}

export class BaseAt {
    static REGEX = /@At\("([^"]*)"\)/;
    where: string;

    constructor(where: string) {
        this.where = where;
    }
}

export class ExtendedAt {
    static REGEX = /@At\s*\(\s*method\s*=\s*"([^"]*)"(?:,\s*ordinal\s*=\s*(\d*))?\)/;
    method: string;
    ordinal: number;

    constructor(method: string, ordinal?: number) {
        this.method = method;
        this.ordinal = ordinal || 0;
    }
}