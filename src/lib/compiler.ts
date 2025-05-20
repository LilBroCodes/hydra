import {getCompressedCode, getParamCount} from "../utils/utils";
import { processSourceFile } from "../source/processor";
import { Mixin } from "../mixin/mixin";

import fs from "fs";
import path from "path";

export function run(mixinFile: string, sourceFile: string, outDir: string = "./out/") {
    const outPath = path.join(outDir, sourceFile);
    const outDirPath = path.dirname(outPath);
    if (!fs.existsSync(outDirPath)) {
        fs.mkdirSync(outDirPath, { recursive: true });
    }

    const source = processSourceFile(sourceFile);
    const rawSource = fs.readFileSync(sourceFile, "utf-8");
    const mixin = Mixin.ofFile(mixinFile);

    const lines = rawSource.split(/\r?\n/);

    type Insertion = { line: number; column: number; code: string };
    const insertionsByLine = new Map<number, Insertion[]>();

    for (const method of mixin.methods) {
        const sourceFunc = source.get({
            name: method.match.method,
            paramAmount: getParamCount(method.code),
            ordinal: method.match.ordinal
        });

        if (sourceFunc) {
            const lineIndex = sourceFunc.startLine - 1;

            if (lineIndex < 0 || lineIndex >= lines.length) {
                console.error(`Invalid insertion line for method ${method.match.method}. Skipping.`);
                continue;
            }

            const columnIndex = sourceFunc.startColumn + 1;

            const codeToInsert = getCompressedCode(method.code);

            if (!insertionsByLine.has(lineIndex)) {
                insertionsByLine.set(lineIndex, []);
            }
            insertionsByLine.get(lineIndex)!.push({
                line: lineIndex,
                column: columnIndex,
                code: codeToInsert,
            });
        } else {
            console.error(`Method ${method.match.method}(${getParamCount(method.code)}) not found!`);
        }
    }

    for (const [, insertions] of insertionsByLine.entries()) {
        insertions.sort((a, b) => a.column - b.column);
    }

    for (const [lineIndex, insertions] of insertionsByLine.entries()) {
        let lineText = lines[lineIndex];
        let offset = 0;

        for (const insertion of insertions) {
            const pos = insertion.column + offset;

            if (pos < 0 || pos > lineText.length) {
                console.error(`Invalid insertion position on line ${lineIndex + 1}. Skipping insertion.`);
                continue;
            }

            lineText = lineText.slice(0, pos) + insertion.code + lineText.slice(pos);
            offset += insertion.code.length;
        }

        lines[lineIndex] = lineText;
    }

    const modifiedSource = lines.join("\n");
    fs.writeFileSync(outPath, modifiedSource);

    console.log(`Wrote modified source file to '${outPath}'.`);
}
