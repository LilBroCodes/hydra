import { LoadedSource, FunctionEntry } from "./types";
import fs from "fs";
import path from "path";
import traverse from "@babel/traverse";
import * as parser from "@babel/parser";
import * as t from "@babel/types";

export function parseSource(code: string): LoadedSource {
    const loaded = new LoadedSource();

    const ast = parser.parse(code, {
        sourceType: "unambiguous",
        plugins: ["jsx", "typescript"],
        ranges: false,
        tokens: false
    });

    const functionCount = new Map<string, number>();

    function getOrdinalKey(name: string, params: number): string {
        return `${name}::${params}`;
    }

    traverse(ast, {
        enter(path) {
            let node = path.node;

            if (
                t.isFunctionDeclaration(node) ||
                t.isFunctionExpression(node) ||
                t.isArrowFunctionExpression(node)
            ) {
                let name = "anonymous";

                if (t.isFunctionDeclaration(node) && node.id?.name) {
                    name = node.id.name;
                } else if (
                    (t.isFunctionExpression(node) || t.isArrowFunctionExpression(node)) &&
                    t.isVariableDeclarator(path.parent) &&
                    t.isIdentifier(path.parent.id)
                ) {
                    name = path.parent.id.name;
                }

                const key = getOrdinalKey(name, node.params.length);
                const ordinal = functionCount.get(key) || 0;
                functionCount.set(key, ordinal + 1);

                const entry = new FunctionEntry(
                    name,
                    node.params.length,
                    node.body.loc?.start || node.loc?.start || { line: 0, column: 0 },
                    node.body.loc?.end || node.loc?.end || { line: 0, column: 0 }
                );

                loaded.functions.push({ ordinal, data: entry });
            }
        }
    });

    return loaded;
}

export function parseSourceFile(filename: string): LoadedSource {
    return parseSource(fs.readFileSync(path.resolve(filename), "utf-8"));
}
