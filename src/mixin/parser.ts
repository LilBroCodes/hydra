import fs from 'fs';
import path from 'path';

const INJECT_REGEX = /\/\/\s*@Inject\s*\(\s*method\s*=\s*"([^"]+)"\s*,\s*at\s*=\s*"([^"]+)"(?:\s*,\s*ordinal\s*=\s*(\d+))?\s*\)/;

export function parse(code: string) {
    const lines = code.split('\n');

    const results: Array<{ match: { method: string; at: string; ordinal: number }; functionCode: string }> = [];

    for (let i = 0; i < lines.length; i++) {
        const match = INJECT_REGEX.exec(lines[i]);
        if (match) {
            let j = i + 1;

            while (j < lines.length && /^\s*(\/\/.*)?$/.test(lines[j])) {
                j++;
            }

            let braceCount = 0;
            let funcLines: string[] = [];
            let started = false;

            while (j < lines.length) {
                const line = lines[j];
                if (!started) {
                    if (/function\s+[\w$]+\s*\(.*\)\s*\{/.test(line) || /const\s+[\w$]+\s*=\s*\(?.*?\)?\s*=>\s*\{/.test(line)) {
                        started = true;
                    } else {
                        j++;
                        continue;
                    }
                }

                funcLines.push(line);
                braceCount += (line.match(/{/g) || []).length;
                braceCount -= (line.match(/}/g) || []).length;

                if (started && braceCount === 0) {
                    break;
                }

                j++;
            }

            results.push({
                match: {
                    method: match[1],
                    at: match[2],
                    ordinal: parseInt(match[3]) || 0,
                },
                functionCode: funcLines.join('\n'),
            });

            i = j;
        }
    }

    return results;
}

export function parseMixin(filename: string) {
    return parse(fs.readFileSync(path.resolve(filename), 'utf-8'));
}
