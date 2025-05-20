import {MixinOfFile} from "./mixin.ofFile";

const tests = [
    new MixinOfFile()
]

for (const test of tests) {
    test.update();
}