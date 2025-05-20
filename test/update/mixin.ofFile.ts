import {Mixin} from "../../src/mixin/mixin";
import fs from "fs";
import path from "path";
import {TestUpdate} from "./updater";

export class MixinOfFile extends TestUpdate {
    runUpdate() {
        const mixin = Mixin.ofFile("test/resources/template.js");
        const output = JSON.stringify(mixin, null, 2);

        const outputPath = path.resolve("test/expected/mixin.ofFile.json");
        fs.writeFileSync(outputPath, output, "utf-8");
    }
}
