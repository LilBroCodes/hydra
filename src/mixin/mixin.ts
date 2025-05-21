import {Tag} from "./tags/tag";
import {parseMixinCode} from "./mixinParser";
import {BaseAt, ExtendedAt} from "./tags/at";
import {Inject} from "./tags/inject";
import {ModifyReturnValue} from "./tags/modifyReturnValue";
import fs from "fs";
import path from "path";

export class Mixin {
    code: string;
    methods: TaggedMethod[];

    constructor(code: string) {
        this.code = code;

        const rawMethods = parseMixinCode(this.code);
        this.methods = [];

        for (const method of rawMethods) {
            this.methods.push(new TaggedMethod(
                method.line,
                method.definitionCode,
                method.comment,
                Tag.fromString(method.comment)
            ));
        }
    }

    static ofFile(file: string) {
        return new Mixin(fs.readFileSync(path.resolve(file), "utf-8"));
    }
}

export class TaggedMethod {
    line: number;
    code: string
    comment: string
    tag: BaseAt | ExtendedAt | Inject | ModifyReturnValue | null

    constructor(line: number, code: string, comment: string, tag: BaseAt | ExtendedAt | Inject | ModifyReturnValue | null) {
        this.line = line;
        this.code = code;
        this.comment = comment;
        this.tag = tag;
    }
}