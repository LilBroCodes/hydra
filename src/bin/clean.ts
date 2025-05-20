import fs from "fs";
import path from "path";

export function exec() {
    console.log("Checking for build cache...")
    if (fs.existsSync(path.resolve(".build_cache.json"))) {
        fs.rmSync(path.resolve(".build_cache.json"))
        console.log("Removed build cache.")
    }

    console.log("Checking for build output...")
    if (fs.existsSync(path.resolve("./out/"))) {
        fs.rmSync(path.resolve("./out/"), { recursive: true })
        console.log("Removed build output.")
    }

    console.log("Done.")
}