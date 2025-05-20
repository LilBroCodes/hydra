import { loadConfig } from "../generator/config";
import { generate } from "../generator/generator";
import { findProjectFile } from "../utils/utils";

export function exec() {
    console.log("Checking for project file...")

    const file = findProjectFile();
    if (file) {
        console.log(`Loading project ${file}...`)
        const mod = loadConfig(`${file}.hproj`);
        console.log("Starting build...")
        generate(mod)
    } else {
        console.warn("Project file not found.")
    }
}