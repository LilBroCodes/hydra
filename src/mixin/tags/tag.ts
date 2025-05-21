import { At } from "./at";
import { Inject } from "./inject";
import { ModifyReturnValue } from "./modifyReturnValue";
import { Unique } from "./unique";

export abstract class Tag {
    abstract ofString(s: string): any;

    static fromString(s: string): Unique | Inject | ModifyReturnValue | null {
        const atMatch = At.ofString(s);
        const injectMatch = Inject.ofString(s);
        const mrvMatch = ModifyReturnValue.ofString(s);
        const uniqueMatch = Unique.ofString(s);

        return mrvMatch || injectMatch || uniqueMatch || null;
    }
}