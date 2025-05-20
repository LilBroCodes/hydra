import { parseSourceFile } from "./parser";
import { LoadedSource } from "./types";
import fs from "fs";
import crypto from "crypto";
import path from "path";

function hashFile(filename: string): string {
    const fileBuffer = fs.readFileSync(filename);
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

export function processSourceFile(inputPath: string, outputPath: string = ".build_cache.json"): LoadedSource {
    const absoluteInputPath = path.resolve(inputPath);
    const absoluteOutputPath = path.resolve(outputPath);

    const currentHash = hashFile(absoluteInputPath);

    if (fs.existsSync(absoluteOutputPath)) {
        try {
            const existing = JSON.parse(fs.readFileSync(absoluteOutputPath, "utf-8"));
            if (existing?.hash === currentHash && existing?.source) {
                console.log("Source unchanged, skipping parsing.");
                return LoadedSource.fromJSON(existing.source);
            }
        } catch (err) {
            console.warn("Failed to read or parse existing .build_cache.json. Reprocessing...");
        }
    }

    const loadedSource = parseSourceFile(absoluteInputPath);

    fs.writeFileSync(
        absoluteOutputPath,
        JSON.stringify({ hash: currentHash, source: loadedSource }, null, 2)
    );

    console.log("Source processed and written to", outputPath);
    return loadedSource;
}