export class FunctionEntry {
    paramAmount: number;
    name: string;
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;

    public constructor(name: string, paramAmount: number, start: any, end: any) {
        this.name = name;
        this.paramAmount = paramAmount;
        this.startLine = start.line;
        this.startColumn = start.column;
        this.endLine = end.line;
        this.endColumn = end.column;
    }

    public asObject(ordinal: number): {
        name: string;
        paramAmount: number;
        ordinal: number;
        start: { line: number, column: number };
        end: { line: number, column: number };
    } {
        return {
            name: this.name,
            paramAmount: this.paramAmount,
            ordinal: ordinal,
            start: { line: this.startLine, column: this.startColumn },
            end: { line: this.endLine, column: this.endColumn }
        }
    }
}

export class LoadedSource {
    functions: Array<{ ordinal: number, data: FunctionEntry }> = [];

    public get(entry: { name: string, paramAmount: number, ordinal?: number }) : FunctionEntry | null {
        const fixedEntry = {
            name: entry.name,
            paramAmount: entry.paramAmount,
            ordinal: entry.ordinal || 0
        };

        for (const func of this.functions) {
            const obj = func.data.asObject(func.ordinal);

            if (
                obj.name === fixedEntry.name &&
                obj.paramAmount === fixedEntry.paramAmount &&
                obj.ordinal === fixedEntry.ordinal
            ) {
                return func.data;
            }
        }

        return null;
    }

    public static fromJSON(json: any): LoadedSource {
        const loaded = new LoadedSource();
        loaded.functions = json.functions.map((f: any) => ({
            ordinal: f.ordinal,
            data: new FunctionEntry(
                f.data.name,
                f.data.paramAmount,
                { line: f.data.startLine, column: f.data.startColumn },
                { line: f.data.endLine, column: f.data.endColumn }
            )
        }));
        return loaded;
    }
}