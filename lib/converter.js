import fs from 'fs';
import path from 'path';
import colors from 'colors';
import { parse } from 'csv-parse';
import {GetTransformer} from './processor.js';

export async function Converter(filePath, namespace, delimiterIn = ',', delimiterOut = '|', outDir = '.') {
    if (!fs.existsSync(filePath)) {
        throw new Error(`file '${filePath}' does not exist`);
    }

    outDir = path.resolve(outDir);

    if (!fs.existsSync(outDir)) {
        throw new Error(`directory '${outDir}' does not exist`);
    }

    if (!fs.statSync(outDir).isDirectory()) {
        throw new Error(`'${outDir}' is not a directory`);
    }

    const fileExt = path.extname(filePath);
    const fileBase = path.basename(filePath, fileExt);
    const outputFileName = `${fileBase}-namespace_${namespace}_${fileExt}`
    const outputFile = path.resolve(outDir, outputFileName);

    console.log([
            `Converting ${filePath}`.bgMagenta,
            'Input file delimiter: '.green + `${delimiterIn}`.blue,
            'output file delimiter: '.green +`${delimiterOut}`.blue,
            'output file: '.green + `${outputFile}`.blue,
        ].join('\n')
    );

    const streamIn = fs.createReadStream(filePath);
    const streamOut = fs.createWriteStream(outputFile);
    const parser = parse({delimiter: delimiterIn});

    streamIn.pipe(parser).pipe(GetTransformer(delimiterOut)).pipe(streamOut);
}
