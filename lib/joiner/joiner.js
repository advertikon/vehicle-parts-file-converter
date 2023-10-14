import fs from "fs";
import path from "path";
import "colors";
import { parse } from "csv-parse";
import { ConvertLine, DetectFileFormat } from "../util.js";
import { StorageWrite, prepareBuckets } from "./disc-storage.js";
import { cleanUpFiles, preprocessFiles } from "./preprocessor.js";

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
        // raw: true,
        // skipEmptyLines: true,
        relax_column_count: true,
        // on_record: ({raw, record}, {error}) => {
        //   if (error) {
        //     console.log(error.code);
        //     console.log(raw)
        //     console.log(record)
        //   }

        //   return record;
        // }
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
      );
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
}
