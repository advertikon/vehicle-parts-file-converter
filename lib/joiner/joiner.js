import fs from "fs";
import path from "path";
import "colors";
import { parse } from "csv-parse";
import {
  ConvertLine,
  DetectFileFormat,
} from "../util.js";
import { StorageWrite, prepareBuckets } from "./disc-storage.js";

export async function Joiner(data) {
  const {
    inputDir,
    outputDir,
    outputFileName,
    inputDelimiter,
    outpurtDelimiter,
    bucketsCount
  } = data;

  let recordsCount = 0;
  prepareBuckets(bucketsCount, outputDir, outputFileName, outpurtDelimiter);
  const filePrefix = outputFileName.replace(/^([^.]+)\.(.+)$/, `$1-`);

  for (const item of fs.readdirSync(inputDir)) {
    if (
      (inputDir === outputDir && item.startsWith(filePrefix)) ||
      !fs.statSync(path.join(inputDir, item)).isFile()
    ) {
      continue;
    }

    let header = null;
    let recordsSet = [];

    console.log(`Processing file '${item}'...`.green);

    const parser = fs.createReadStream(path.join(inputDir, item)).pipe(
      parse({
        delimiter: inputDelimiter,
        quote: null,
        relaxQuotes: true,
        skipEmptyLines: true,
      })
    );

    for await (const record of parser) {
      if (!header) {
        header = record;
        continue;
      }

      const convertedLine = ConvertLine(record, DetectFileFormat(header), header);
      recordsSet = recordsSet.concat(convertedLine);
      recordsCount += convertedLine.length;

      if (recordsCount % 10000 === 0) {
        StorageWrite(recordsSet, outpurtDelimiter, bucketsCount, outputDir, outputFileName);
        recordsSet = [];
      }
    }

    if (recordsCount % 10000 === 0) {
      StorageWrite(recordsSet, outpurtDelimiter, bucketsCount, outputDir, outputFileName);
      recordsSet = [];
    }

    console.log(`Records count: ${recordsCount}`.green);
  }
}
