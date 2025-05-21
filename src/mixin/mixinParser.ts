import fs from 'fs';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';

export function parseMixinFile(filePath: string): { line: number, comment: string, definitionCode: string; }[] {
    return parseMixinCode(fs.readFileSync(filePath, 'utf8'));
}

export function parseMixinCode(code: string): { line: number, comment: string, definitionCode: string; }[] {
    const ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
        attachComment: true,
        tokens: true,
        ranges: true,
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true,
        errorRecovery: true,
    });

    const results: {
        line: number;
        comment: string;
        definitionCode: string;
    }[] = [];

    traverse(ast, {
        enter(path) {
            if (
                path.isFunctionDeclaration() ||
                path.isFunctionExpression() ||
                path.isArrowFunctionExpression() ||
                path.isClassDeclaration() ||
                path.isClassExpression()
            ) {
                const node = path.node;

                const leadingComments = (node.leadingComments || []).filter(c =>
                    c.type === 'CommentLine' && c.value.includes('@')
                );

                for (const comment of leadingComments) {
                    if (comment.loc && node.loc) {
                        if (comment.loc.end.line === node.loc.start.line - 1) {
                            const generated = generate(node, {}, code).code;
                            results.push({
                                line: comment.loc.start.line,
                                comment: comment.value.trim(),
                                definitionCode: generated,
                            });
                        }
                    }
                }
            }
        },
    });

    return results;
}
