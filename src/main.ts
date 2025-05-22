import { Command } from "commander";
import { exec as clean } from "./bin/clean";
import { exec as build } from "./bin/build";

const program = new Command();

program
    .name("hydra")
    .description("CLI Interface for Hydra")
    .version("1.2.5");

const tasks: Record<string, () => Promise<void> | void> = {
    build,
    clean
};

program
    .argument("[tasks...]", "Tasks to run in order (e.g. build clean)")
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

program.parse(process.argv);