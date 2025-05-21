import {cleanComments, getCompressedCode, getParamCount} from "../utils/utils";
import { processSourceFile } from "../source/processor";
import { Mixin } from "../mixin/mixin";

import fs from "fs";
import path from "path";
import {Inject} from "../mixin/tags/inject";
import {Unique} from "../mixin/tags/unique";

export function run(
  mixinFile: string,
  sourceFile: string,
  outDir: string = "./out/"
) {
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
  const unique: string[] = [];

  for (const method of mixin.methods) {
    if (method.tag instanceof Inject) {
      const sourceFunc = source.get({
        name: method.tag.method,
        paramAmount: getParamCount(method.code),
        ordinal: method.tag.ordinal,
      });

      if (sourceFunc) {
        const at = method.tag.at.where == "TAIL" ? "TAIL" : "HEAD"
        const lineIndex = at == "HEAD" ? sourceFunc.startLine - 1 : sourceFunc.endLine - 1;

        if (lineIndex < 0 || lineIndex >= lines.length) {
          console.error(
              `Invalid insertion line for method ${method.tag.method}. Skipping.`
          );
          continue;
        }

        const columnIndex = at == "HEAD" ? sourceFunc.startColumn + 1 : sourceFunc.endColumn - 1;

        const codeStart = at == "TAIL" && lines[lineIndex].substring(0, columnIndex) != "" && !lines[lineIndex].match(/\s*;\s*/) ? ";" : "";
        const codeToInsert = codeStart + getCompressedCode(method.code);

        if (!insertionsByLine.has(lineIndex)) {
          insertionsByLine.set(lineIndex, []);
        }
        insertionsByLine.get(lineIndex)!.push({
          line: lineIndex,
          column: columnIndex,
          code: codeToInsert,
        });
      } else {
        console.error(
            `Method ${method.tag.method}(${getParamCount(
                method.code
            )}) not found!`
        );
      }
    } else if (method.tag instanceof Unique) {
      unique.push(
          cleanComments(method.code),
      )
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
        console.error(
          `Invalid insertion position on line ${
            lineIndex + 1
          }. Skipping insertion.`
        );
        continue;
      }

      lineText = lineText.slice(0, pos) + insertion.code + lineText.slice(pos);
      offset += insertion.code.length;
    }

    lines[lineIndex] = lineText;
  }

  let modifiedSource = lines.join("\n");

  console.log('Inserting unique code...')
  for (const string of unique) {
    modifiedSource = string + modifiedSource;
  }

  fs.writeFileSync(outPath, modifiedSource);

  console.log(`Wrote modified source file to '${outPath}'.`);
}
