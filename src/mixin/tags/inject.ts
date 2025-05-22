import { At, BaseAt } from "./at";
import {Tag} from "./tag";

// noinspection SuspiciousTypeOfGuard
export class Inject {
    static REGEX = /@Inject\s*\(\s*method\s*=\s*"([^"]+)"\s*,\s*at\s*=\s*(@At\("[^"]*"(?:\s*,\s*offset\s*=\s*\(\s*\d+\s*,\s*\d+\s*\))?\))\s*(?:,\s*ordinal\s*=\s*(\d+))?\s*\)/;

    method: string
    at: BaseAt
    ordinal: number

    constructor(method: string, at: BaseAt, ordinal?: number) {
        this.method = method
        this.at = at
        this.ordinal = ordinal || 0;
    }

    static ofString(s: string): Inject | null {
        const match = s.match(Inject.REGEX);

        if (match) {
            const at = At.ofString(match[2]);
            if (!(at instanceof BaseAt)) return null;

            return new Inject(
                match[1],
                at,
                parseInt(match[3] || "0", 10),
            )
        }

        return null;
    }
}