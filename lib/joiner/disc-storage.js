import path from "path";
import fs from "fs";
import _ from 'lodash'
import { csvHeader, getBucket, semaFieldIndex } from "../util.js";

export function prepareBuckets(bucketsCount, outputDir, outputFileName, outpurtDelimiter) {
    const filePrefix = outputFileName.replace(/^([^.]+)\.(.+)$/, `$1-`);

    for(const item of fs.readdirSync(outputDir)) {
        if (item.startsWith(filePrefix)) {
            fs.unlinkSync(path.join(outputDir, item));
        }
    }

    for(let i = 0; i < bucketsCount; i++) {
        const bucketFileName = outputFileName.replace(/^([^.]+)\.(.+)$/, `$1-${i}.$2`)
        fs.writeFileSync(path.join(outputDir, bucketFileName), csvHeader.join(outpurtDelimiter) + "\n");
    }
}


export function StorageWrite(lines, delimiter, bucketsCount, outputDir, outputFileName) {
    const skuIndex = semaFieldIndex('Part');
    const grouped = _.groupBy(lines, line => getBucket(bucketsCount, line[skuIndex]));

    for(const [backet, group] of Object.entries(grouped)) {
        const bucketFileName = outputFileName.replace(/^([^.]+)\.(.+)$/, `$1-${backet}.$2`)
        fs.appendFileSync(path.join(outputDir, bucketFileName), group.map(line => line.join(delimiter)).join('\n') + '\n')
    }
}