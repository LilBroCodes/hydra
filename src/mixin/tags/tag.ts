import { Inject } from "./inject";
import { Unique } from "./unique";

export abstract class Tag {
    static fromString(s: string): Unique | Inject | null {
        const injectMatch = Inject.ofString(s);
        const uniqueMatch = Unique.ofString(s);

        return injectMatch || uniqueMatch || null;
    }
}