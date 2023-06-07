import { transform } from 'stream-transform';
import {FILE_FORMAT_UNKNOWN} from './constants.js';
import {ConvertLine, csvHeader, DetectFileFormat} from './util.js';
import colors from 'colors';

let header = null;
let fileFormat = FILE_FORMAT_UNKNOWN;
let haveError = false;
const LINE_BREAK = '\r\n';
let delimiter = '|';

function ShowError(message) {
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
            ShowError('Unsupported file format');
            return;
        }

        console.log('File formant detected as: '.blue + `${fileFormat}`.bgGreen);
        callback(null, csvHeader.join(delimiter) + LINE_BREAK);
    } else {
        let lines;
        try {
            lines = ConvertLine(record, fileFormat, header);
        } catch (error) {
            ShowError(error.message);
            return;
        }

        callback(null, lines.map(items => items.join(delimiter)).join(LINE_BREAK)  + LINE_BREAK);
    }
}, {
    parallel: 1
});

export function GetTransformer(delimiterOut) {
    delimiter = delimiterOut;
    return transformer;
}

