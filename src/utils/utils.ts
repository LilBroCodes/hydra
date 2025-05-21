import * as t from '@babel/types';
import * as parser from '@babel/parser';
import traverse from "@babel/traverse";
import generate from '@babel/generator';
import fs from "fs";
import path from "path";

export function findMethodCalls(code: string) {
    const ast = parser.parse(code, {
        sourceType: 'unambiguous',
        plugins: ['typescript'],
    });

    type MethodCall = {
        method: string,
        paramCount: number,
        ordinal: number
    }
    const calls: MethodCall[] = [];
    const ordinals = new Map<string, number>();

    traverse(ast, {
        CallExpression(path) {
            let methodName = '';
            const callee = path.node.callee;

            if (callee.type === 'Identifier') {
                methodName = callee.name;
            } else if (callee.type === 'MemberExpression') {
                if (callee.property.type === 'Identifier') {
                    methodName = callee.property.name;
                } else if (callee.property.type === 'StringLiteral' || callee.property.type === 'NumericLiteral') {
                    methodName = String(callee.property.value);
                }
            }

            // @ts-ignore
            ordinals.set(methodName, (ordinals.has(methodName) ? ordinals.get(methodName) : 0) + 1)

            calls.push({
                method: methodName,
                paramCount: path.node.arguments.length,
                ordinal: ordinals.get(methodName) || 0,
            })
        }
    })

    return calls;
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

export function cleanComments(raw: string): string {
    return raw.split(/\n/)
        .filter(string => !string.includes("//"))
        .join("\n");
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

export function findProjectFile(): string | undefined {
  const cwd = process.cwd();
  const files = fs.readdirSync(cwd);

  for (const file of files) {
    if (path.extname(file) === '.hproj') {
      return path.basename(file, '.hproj');
    }
  }

  return undefined;
}
