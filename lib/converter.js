import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import {GetTransformer} from './processor.js';

export async function Converter(filePath, namespace, delimiterIn = ',', delimiterOut = '|') {
    if (!fs.existsSync(filePath)) {
        throw new Error(`file ${filePath} does not exist`);
    }

    const fileExt = path.extname(filePath);
    const fileBase = path.basename(filePath, fileExt);
    const outputFileName = `${fileBase}-namespace_${namespace}_${fileExt}`
    const outputFile = path.resolve(outputFileName);

    console.log(`Converting ${filePath}. Input file delimiter: '${delimiterIn}', output file delimiter: '${delimiterOut}', output file: '${outputFile}'`);

    const streamIn = fs.createReadStream(filePath);
    const streamOut = fs.createWriteStream(outputFile);
    const parser = parse({delimiter: delimiterIn});

    streamIn.pipe(parser).pipe(GetTransformer(delimiterOut)).pipe(streamOut);
}
