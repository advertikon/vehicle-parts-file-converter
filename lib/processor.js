import { transform } from 'stream-transform';
import {FILE_FORMAT_UNKNOWN} from './constants.js';
import {ConvertLine, csvHeader, DetectFileFormat} from './util.js';

let header = null;
let fileFormat = FILE_FORMAT_UNKNOWN;
let haveError = false;
const LINE_BREAK = '\r\n';
let delimiter = '|';

function error(message) {
    haveError = true;
    console.log(message.red);
}

const transformer = transform((record, callback) => {
    if (haveError) {
        return;
    }

    if (!header) {
        header = record;
        fileFormat = DetectFileFormat(record);

        if (FILE_FORMAT_UNKNOWN === fileFormat) {
            error('Unsupported file format');
            return;
        }

        console.log(`File formant detected as: ${fileFormat}`);
        callback(null, csvHeader.join(delimiter) + LINE_BREAK);
    } else {
        callback(null, ConvertLine(record, fileFormat).map(items => items.join(delimiter)).join(LINE_BREAK)  + LINE_BREAK);
    }
}, {
    parallel: 1
});

export function GetTransformer(delimiterOut) {
    delimiter = delimiterOut;
    return transformer;
}

