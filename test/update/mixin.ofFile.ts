import {Mixin} from "../../src/mixin/mixin";
import fs from "fs";
import path from "path";
import {TestUpdate} from "./updater";

export class MixinOfFile extends TestUpdate {
    runUpdate() {
        const mixin = new Mixin(fs.readFileSync("test/resources/template.js", "utf-8"));
        const output = JSON.stringify(mixin, null, 2);

        const outputPath = path.resolve("test/expected/mixin.ofFile.json");
        fs.writeFileSync(outputPath, output, "utf-8");
    }
}
