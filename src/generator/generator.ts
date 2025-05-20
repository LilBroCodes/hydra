import { HydraMod } from "./types";
import { base } from "./static";

import fs from "fs";
import path from "path";
import { run } from "../lib/compiler";

export function generate(mod: HydraMod, outDir: string = "./out/") {
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, {recursive: true})
    }

    console.log("Copying base addon...")
    fs.writeFileSync(path.join(outDir, "background.js"), base.script)
    const manifest = base.config;
    const files: string[] = [];

    console.log("Adding files to resource config...")
    for (const file of mod.config.files) {
        if (!fs.existsSync(path.resolve(file.name))) {
            console.warn(`File '${file.name}' doesn't exist, skipping...`)
            continue
        }
        files.push(file.name);
    }

    console.log("Building modified source files...")
    for (const file of mod.modFiles) {
        if (!fs.existsSync(path.resolve(file.name))) {
            console.warn(`File '${file.name}' doesn't exist, skipping...`)
            continue
        } else if (!fs.existsSync(path.resolve(file.sourceFile))) {
            console.warn(`The source file of '${file.name}' (${file.sourceFile}) doesn't exist, skipping...`)
            continue
        }

        run(file.name, file.sourceFile, outDir)
    }

    fs.writeFileSync(path.join(outDir, "manifest.json"), manifest.replace("\"%EXPOSED_FILES%\"", getFileStrings(files).join(", ")))
    
    console.log("Writing files.json...")
    fs.writeFileSync(path.join(outDir, "files.json"), JSON.stringify(mod.config, null, 2));
}

function getFileStrings(files: string[]) {
    const fStrings = [];
    for (const file of files) {
        fStrings.push(`"${file}"`);
    }
    return fStrings;
}
