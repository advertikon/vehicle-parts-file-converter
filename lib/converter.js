import fs from 'fs';
import { parse } from 'csv-parse';
import {GetTransformer} from './processor.js';

export async function Converter(filePath, delimiterIn = ',', delimiterOut = '|') {
    if (!fs.existsSync(filePath)) {
        throw new Error(`file ${filePath} does not exist`);
    }

    console.log(`Converting ${filePath}. Delimiter: '${delimiterIn}'`);

    const streamIn = fs.createReadStream(filePath);
    const streamOut = fs.createWriteStream('./out.csv');
    const parser = parse({delimiter: delimiterIn});

    streamIn.pipe(parser).pipe(GetTransformer(delimiterOut)).pipe(streamOut);
}
