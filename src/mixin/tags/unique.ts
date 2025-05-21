export class Unique {
    static REGEX = /\s*@Unique\s*/;

    static ofString(s: string): Unique | null {
        return s.match(Unique.REGEX) ? new Unique() : null;
    }
}