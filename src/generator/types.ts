export class HydraMod {
    name: string;
    version: string;
    modFiles: HydraModFile[]
    config: HydraConfig

    constructor(name: string, version: string, modFiles: HydraModFile[], config: HydraConfig) {
        this.name = name,
        this.version = version
        this.modFiles = modFiles;
        this.config = config
    }
}

export class HydraModFile {
    name: string
    sourceFile: string

    constructor(name: string, sourceFile: string) {
        this.name = name;
        this.sourceFile = sourceFile;
    }
}

export class HydraConfig {
    urls: string[]
    files: HydraConfigFile[]

    constructor(urls: string[], files: HydraConfigFile[]) {
        this.urls = urls;
        this.files = files;
    }
}

export class HydraConfigFile {
    regex: string
    name: string
    
    constructor(regex: string, name: string) {
        this.regex = regex;
        this.name = name;
    }
}