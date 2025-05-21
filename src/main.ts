import { Command } from "commander";
import { exec as clean } from "./bin/clean";
import { exec as build } from "./bin/build";


const program = new Command();

program
    .name("hydra")
    .description("CLI Interface for Hydra")
    .version("1.2.4")

program
    .command("build")
    .description("Build the project in the current folder if exists")
    .action(build)

program
    .command("clean")
    .description("Cleans the current folder from any Hydra build artifacts")
    .action(clean)

program.parse(process.argv)