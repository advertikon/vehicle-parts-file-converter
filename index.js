import { Command } from "commander";
import { convertCommand } from "./commands/convert.command.js";
import { joinCommand } from "./commands/join.command.js";
import pkg from "./package-lock.json" assert { type: "json" };

const program = new Command();
program.version(pkg.version, "-v, --version");

convertCommand(program);
joinCommand(program);

await program.parseAsync();
