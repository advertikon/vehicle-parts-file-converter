import { Command } from 'commander';
import colors from 'colors';
import { Converter } from './lib/converter.js';

const program = new Command();

program
    .command('convert <file-name>')
    .description('Convert file to proper format')
    .action(async (fileName) => {
        await Converter(fileName).catch(e => console.error(`Error: ${e.message}`.red));
    });

await program.parseAsync();
