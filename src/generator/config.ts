import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';
import { HydraConfig, HydraConfigFile, HydraMod, HydraModFile } from './types';

export function loadConfig(filename: string): HydraMod {
    const raw = fs.readFileSync(path.resolve(filename), "utf-8").toString();
    const config = parse(raw);

    const files: HydraConfigFile[] = [];
    const modFiles: HydraModFile[] = []

    for (const file of config.files) {
        files.push(new HydraConfigFile(
            file.regex,
            file.sourceFile
        ))

        modFiles.push(new HydraModFile(
            file.name,
            file.sourceFile
        ))
    }

    const hConfig: HydraConfig = new HydraConfig(
        config.urls,
        files
    )

    return new HydraMod(
        config.name,
        config.version,
        modFiles,
        hConfig
    );
}