import { Command } from "commander";
import { exec as clean } from "./bin/clean";
import { exec as build } from "./bin/build";
import {feToString, findClosestFunction, generateParams, loadBuildCache} from "./bin/methodFinder";
import cp from "copy-paste";

const program = new Command();

function findFunction(startLine: string, startColumn: string, endLine: any, endColumn: any) {
    const parsedStartLine = parseInt(startLine, 10);
    const parsedStartColumn = parseInt(startColumn, 10);

    if (isNaN(parsedStartLine) || isNaN(parsedStartColumn)) {
        console.error("Error: startLine and startColumn must be integers.");
        process.exit(1);
    }

    const buildCache = loadBuildCache();

    if (!buildCache) {
        console.error("Error: No build cache found.");
        process.exit(1);
    }

    return findClosestFunction(buildCache.source.functions, parsedStartLine, parsedStartColumn, endLine, endColumn);
}

program
    .name("hydra")
    .description("CLI Interface for Hydra")
    .version("1.2.6");

const tasks: Record<string, () => Promise<void> | void> = {
    build,
    clean
};

program
    .argument("[tasks...]", "If no valid commands are provided, then these tasks will be ran in order of input. Valid tasks are 'build', and 'clean'.")
    .action(async (taskList: string[]) => {
        if (!taskList.length) {
            console.error("No tasks provided.");
            program.help();
            return;
        }

        for (const task of taskList) {
            const execTask = tasks[task];
            if (execTask) {
                console.log(`:${task}`);
                await execTask();
            } else {
                console.error(`Unknown task :${task}!`);
                process.exit(1);
            }
        }
    });

program
    .command("find-function <startLine> <startColumn>")
    .description("Find the name, parameter count and ordinal of a function in the build cache based on it's location in the source code")
    .option("-E, --end-line <endLine>", "End Line", parseInt)
    .option("-e, --end-column <endColumn>", "End Column", parseInt)
    .action((startLine, startColumn, options) => {
        const func = findFunction(startLine, startColumn, options["endLine"], options["endColumn"]);

        if (func) {
            console.log(`${feToString(func)}`);
        } else {
            console.error("Error: No function found.");
            process.exit(1);
        }
    });

program
    .command("find-mixin <startLine> <startColumn>")
    .description("Works the same as find-function, except it copies a tagged function version of it to the clipboard.")
    .option("-E, --end-line <endLine>", "End Line", parseInt)
    .option("-e, --end-column <endColumn>", "End Column", parseInt)
    .action((startLine, startColumn, options) => {
        const func = findFunction(startLine, startColumn, options["endLine"], options["endColumn"]);

        if (func) {
            const lines: string[] = [];
            lines.push(`// @Inject(method = ${func.data.name}, at = @At("HEAD")${func.ordinal == 0 ? "" : `, ordinal=${func.ordinal}`})`);
            lines.push(`function modified${func.data.name.slice(0, 1).toUpperCase() + func.data.name.slice(1)}${generateParams(func.data.paramAmount)} {`);
            lines.push(`    `);
            lines.push(`}`)
            const outFunc = lines.join("\n");
            cp.copy(outFunc)
            console.log("Wrote the following code to the clipboard:")
            for (const line of lines) {
                console.log(`  ${line}`);
            }
        } else {
            console.error("Error: No function found.");
            process.exit(1);
        }
    })

program.parse(process.argv);