import {parse, parseMixin} from "./parser";

import fs from 'fs';

export class Mixin {
    code: string;
    lines: string[] = [];
    methods: MixinMethod[];

    constructor(code: string) {
        this.code = code;
        this.lines = code.split('\n');

        this.methods = [];
    }

    clearMethods() {
        this.methods = [];
    }

    parseFile(filename?: string) {
        this.clearMethods();
        const parsed = filename ? parseMixin(filename) : parse(this.code);
        parsed.forEach(method => this.methods.push(MixinMethod.ofObject(method)));
    }

    static ofFile(filename: string) {
        const mixin = new Mixin(fs.readFileSync(filename, 'utf-8'));
        mixin.parseFile(filename);
        return mixin;
    }
}

export class MixinMethod {
    match: { method: string; at: string; ordinal: number }
    code: string

    constructor(match: { method: string; at: string; ordinal?: number }, code: string) {
        this.match = {
            method: match.method,
            at: match.at,
            ordinal: match.ordinal || 0
        };

        this.code = code;
    }

    static ofObject(method: { match: { method: string; at: string; ordinal?: number }, functionCode: string }) {
        return new MixinMethod(
            method.match,
            method.functionCode
        )
    }
}
