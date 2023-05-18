import { Command } from 'commander';
import colors from 'colors';
import { Converter } from './lib/converter.js';
import fs from 'fs';

const program = new Command();
program.version(JSON.parse(fs.readFileSync('package.json')).version, '-v, --version')

program
    .command('convert <file-name>')
    .description('Convert file to proper format')
    .requiredOption('-n --namespace <namespace>', 'table name')
    .option('--separator-in <delimiter-in>', 'input file fields delimiter', ',')
    .option('--separator-out <delimiter-out>', 'output file fields delimiter', '|')
    .option('--out-dir <output-dir>', 'output directory', '.')
    .action(async (fileName, options) => {
        const { separatorIn, separatorOut, namespace, outDir } = options;
        await Converter(fileName, namespace, separatorIn, separatorOut, outDir).catch(e => console.error(`Error: ${e.message}`.red));
    });

await program.parseAsync();
