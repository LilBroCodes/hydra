import * as t from '@babel/types';
import * as parser from '@babel/parser';
import traverse from "@babel/traverse";
import generate from '@babel/generator';

export function insertAt(original: string, insert: string, index: number): string {
    return original.slice(0, index) + insert + original.slice(index);
}

export function getCompressedCode(raw: string): string {
    const ast = parser.parse(raw, {
        sourceType: 'unambiguous',
        plugins: ['typescript'],
    });

    let bodyStatements: t.Statement[] = [];

    traverse(ast, {
        FunctionDeclaration(path) {
            bodyStatements = path.node.body.body;
            path.stop();
        }
    });

    if (!bodyStatements.length) return "";

    return bodyStatements
        .map(stmt => generate(stmt).code)
        .join("");
}

export function getParamCount(raw: string): number {
    const ast = parser.parse(raw, {
        sourceType: 'unambiguous',
        plugins: ['typescript'],
    });

    let paramCount = 0;

    traverse(ast, {
        FunctionDeclaration(path) {
            paramCount = path.node.params.length;
            path.stop(); // stop after the first function declaration found
        }
    });

    return paramCount;
}

