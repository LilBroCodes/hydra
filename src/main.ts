import {Mixin} from "./mixin/mixin";

const mixin = Mixin.ofFile("template.js");
console.log(JSON.stringify(mixin, null, 2));