import { Command } from "commander";
import { convertCommand } from "./commands/convert.command.js";
import { joinCommand } from "./commands/join.command.js";
import fs from "fs";

const pkg = fs.readFileSync(new URL('package.json', import.meta.url)).toString();
const program = new Command();
program.version(JSON.parse(pkg).version, "-v, --version");

convertCommand(program);
joinCommand(program);

await program.parseAsync();
