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
        Function(path) {
            const node = path.node;

            let name = "anonymous";

            // Case 1: FunctionDeclaration with a name
            if (t.isFunctionDeclaration(node) && node.id?.name) {
                name = node.id.name;
            }

            // Case 2: FunctionExpression or ArrowFunctionExpression assigned to a variable
            else if (
                (t.isFunctionExpression(node) || t.isArrowFunctionExpression(node)) &&
                t.isVariableDeclarator(path.parent) &&
                t.isIdentifier(path.parent.id)
            ) {
                name = path.parent.id.name;
            }

            // ✅ Case 3: FunctionExpression assigned to object/member (e.g., n[n.length-1] = function x(...) {})
            else if (
                (t.isFunctionExpression(node) || t.isArrowFunctionExpression(node)) &&
                t.isAssignmentExpression(path.parent) &&
                path.parent.right === node
            ) {
                // Try to get function name (e.g., `function a(b) {}`)
                if (t.isFunctionExpression(node) && node.id?.name) {
                    name = node.id.name;
                }

                // Optionally: attempt to extract LHS identifier like `n`
                // if (t.isMemberExpression(path.parent.left) && t.isIdentifier(path.parent.left.object)) {
                //     name = path.parent.left.object.name;
                // }
            }

            const key = `${name}::${node.params.length}`;
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
    });

    return loaded;
}

export function parseSourceFile(filename: string): LoadedSource {
    return parseSource(fs.readFileSync(path.resolve(filename), "utf-8"));
}
