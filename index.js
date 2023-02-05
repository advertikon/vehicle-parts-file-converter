import { Command } from 'commander';
import colors from 'colors';
import { Converter } from './lib/converter.js';

const program = new Command();

program
    .command('convert <file-name>')
    .description('Convert file to proper format')
    .requiredOption('-n --namespace <namespace>', 'table name')
    .option('--separator-in <delimiter-in>', 'input file fields delimiter', ',')
    .option('--separator-out <delimiter-out>', 'output file fields delimiter', '|')
    .action(async (fileName, options) => {
        const { delimiterIn, delimiterOut, namespace } = options;
        await Converter(fileName, namespace, delimiterIn, delimiterOut).catch(e => console.error(`Error: ${e.message}`.red));
    });

await program.parseAsync();
