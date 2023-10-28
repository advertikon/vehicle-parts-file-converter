import fs from "fs";
import path from "path";
import "colors";
import { parse } from "csv-parse";
import { ConvertLine, DetectFileFormat } from "../util.js";
import { StorageWrite, prepareBuckets } from "./disc-storage.js";
import { cleanUpFiles, preprocessFiles } from "./preprocessor.js";
import { OrderSkus } from "./orderer.js";
import { replaceSkus } from "./sku-replacer.js";
import { duplicateFitmentNotes } from "./fitement-notes-duplicator.js";

export async function Joiner(data) {
  const { inputDir, inputDelimiter, tmpSuffix } = data;

  let recordsCount = 0;
  await preprocessFiles(data);
  prepareBuckets(data);

  for (const item of fs.readdirSync(inputDir)) {
    if (
      !item.endsWith(tmpSuffix) ||
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
        relax_column_count: true,
      })
    );

    for await (const record of parser) {
      if (!header) {
        header = record;
        continue;
      }

      const convertedLine = ConvertLine(
        record,
        DetectFileFormat(header),
        header
      ).map(cl => {cl[0] = ''; return cl});
      recordsSet = recordsSet.concat(convertedLine);
      recordsCount += convertedLine.length;

      if (recordsCount % 10000 === 0) {
        StorageWrite(recordsSet, data);
        recordsSet = [];
      }
    }

    if (recordsCount > 0) {
      StorageWrite(recordsSet, data);
      recordsSet = [];
    }

    console.log(`Records count: ${recordsCount}`.green);
  }

  cleanUpFiles(data);
  await OrderSkus(data);
  await replaceSkus(data);
  await duplicateFitmentNotes(data);
}
