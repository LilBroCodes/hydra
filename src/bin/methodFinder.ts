import * as fs from 'fs';

interface FunctionData {
    name: string;
    paramAmount: number;
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
}

interface FunctionEntry {
    ordinal: number;
    data: FunctionData;
}

export function feToString(entry: FunctionEntry): string {
    return `Found function '${entry.data.name}' with ${entry.data.paramAmount} parameter${entry.data.paramAmount == 1 ? "" : "s"}, ordinal ${entry.ordinal}`;
}

interface BuildCache {
    hash: string;
    source: {
        functions: FunctionEntry[];
    };
}

export function loadBuildCache(filePath: string = '.build_cache.json'): BuildCache | null {
    if (!fs.existsSync(filePath)) {
        console.error(`File '${filePath}' not found.`);
        return null;
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
}

function computeDistance(
    data: FunctionData,
    startLine: number,
    startCol: number,
    endLine?: number,
    endCol?: number
): number {
    const d1 = Math.abs(data.startLine - startLine);
    const d2 = data.startColumn - startCol;

    const distStart = d1 + (d2 < 0 ? Math.abs(d2) : 0)

    if (endLine !== undefined && endCol !== undefined) {
        const distEnd =
            Math.abs(data.endLine - endLine) + Math.abs(data.endColumn - endCol);
        return distStart + distEnd;
    }

    return distStart;
}

export function findClosestFunction(
    functions: FunctionEntry[],
    startLine: number,
    startCol: number,
    endLine?: number,
    endCol?: number
): FunctionEntry | null {
    let closest: FunctionEntry | null = null;
    let minDistance = Infinity;

    for (const fn of functions) {
        const distance = computeDistance(fn.data, startLine, startCol, endLine, endCol);
        if (distance < minDistance) {
            minDistance = distance;
            closest = fn;
        }
    }

    return closest;
}

export function generateParams(paramCount: number): string {
    const params: string[] = [];
    const aCharCode = "a".charCodeAt(0);
    const zCharCode = "z".charCodeAt(0);
    const alphabetSize = zCharCode - aCharCode + 1;

    function indexToParamName(index: number): string {
        let name = "";
        while (true) {
            name = String.fromCharCode(aCharCode + (index % alphabetSize)) + name;
            index = Math.floor(index / alphabetSize) - 1;
            if (index < 0) break;
        }
        return name;
    }

    for (let i = 0; i < paramCount; i++) {
        params.push(indexToParamName(i));
    }

    return `(${params.join(", ")})`;
}

