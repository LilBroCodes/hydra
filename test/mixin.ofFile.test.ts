import { strict as assert } from "assert";
import { Mixin } from "../src/mixin/mixin";
import fs from "fs";
import path from "path";

describe('MixinOfFile', () => {
    it('should match the saved baseline', () => {
        const generated = JSON.stringify(Mixin.ofFile("test/resources/template.js"), null, 2);
        const expected = fs.readFileSync(path.resolve("test/expected/mixin.ofFile.json")).toString();

        assert.equal(generated, expected);
    });
});
