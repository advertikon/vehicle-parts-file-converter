import { Command } from 'commander';
import colors from 'colors';
import { Converter } from './lib/converter.js';
import fs from 'fs';
import {readOptions} from "./lib/read-options.js";

const program = new Command();
program.version(JSON.parse(fs.readFileSync('package.json')).version, '-v, --version');

const options = [
    ['namespace', 'Select a namespace', ['sema', 'custom-fitment', 'dci'], 'sema'],
    ['separatorIn', 'Input file delimiter', [',', '|', null], '|'],
    ['separatorOut', 'Output file delimiter', [',', '|'], '|'],
    ['outDir', 'Directory to store output file', null, '.'],
];

program
    .command('convert <file-name>')
    .description('Convert file to proper format')
    .action(async fileName => {
        const { separatorIn, separatorOut, namespace, outDir } = await readOptions(options);
        await Converter(fileName, namespace, separatorIn, separatorOut, outDir).catch(e => console.error(`Error: ${e.message}`.red));
    });

await program.parseAsync();
