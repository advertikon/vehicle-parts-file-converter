import { Command } from 'commander';
import colors from 'colors';
import { Converter } from './lib/converter.js';

const program = new Command();

program
    .command('convert <file-name>')
    .description('Convert file to proper format')
    .option('-p --prefix <prefix>', 'output file prefix')
    .option('--separator-in <delimiter-in>', 'input file fields delimiter', ',')
    .option('--separator-out <delimiter-out>', 'output file fields delimiter', '|')
    .action(async (fileName, options) => {console.log(options)
        const { delimiterIn, delimiterOut } = options;
        await Converter(fileName, delimiterIn, delimiterOut).catch(e => console.error(`Error: ${e.message}`.red));
    });

await program.parseAsync();
