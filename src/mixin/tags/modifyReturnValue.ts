import { At, ExtendedAt } from "./at";

export class ModifyReturnValue {
    static REGEX = /@ModifyReturnValue\s*\(\s*method\s*=\s*"([^"]*)"\s*,\s*at\s*=\s*(@At\([^)]*\))(?:\s*,\s*ordinal\s*=\s*(\d+))?\)/;

    method: string
    at: ExtendedAt
    ordinal: number

    constructor(method: string, at: ExtendedAt, ordinal?: number) {
        this.method = method;
        this.at = at;
        this.ordinal = ordinal || 0;
    }

    static ofString(s: string): ModifyReturnValue | null {
        const match = s.match(ModifyReturnValue.REGEX);

        if (match) {
            const at = At.ofString(match[2]);
            if (!(at instanceof ExtendedAt)) return null;

            return new ModifyReturnValue(
                match[1],
                at,
                parseInt(match[3]),
            )
        }

        return null;
    }
}