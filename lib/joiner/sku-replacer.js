import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import "colors";

export async function replaceSkus(data) {
  const {
    lookupFile,
    inputDelimiter,
    outputDir,
    filePrefix,
    outpurtDelimiter,
  } = data;

  const skuMap = new Map();
  let lookupHeader = null;
  let noMatchHeader;
  let match = [];
  let noMatch = [];

  console.log("Reading lookup file...".green);

  const parser = fs.createReadStream(lookupFile).pipe(
    parse({
      delimiter: inputDelimiter,
      quote: null,
      relaxQuotes: true,
      relax_column_count: true,
    })
  );

  for await (const record of parser) {
    if (!lookupHeader) {
      lookupHeader = record;
      continue;
    }

    skuMap.set(record[2], record[0]);
  }

  for (const item of fs.readdirSync(outputDir)) {
    if (item.startsWith(filePrefix)) {
      let header;
      console.log(`Replacing SKUs in '${item}'...`.green);

      const parser = fs.createReadStream(path.join(outputDir, item)).pipe(
        parse({
          delimiter: outpurtDelimiter,
          quote: null,
          relaxQuotes: true,
          relax_column_count: true,
        })
      );

      for await (const record of parser) {
        if (!header) {
          header = record;
          match.push(record.join(outpurtDelimiter));
          continue;
        }

        if (!noMatchHeader) {
          noMatchHeader = record;
          noMatch.push(record.join(outpurtDelimiter));
          continue;
        }

        if (skuMap.has(record[1])) {
          record[1] = skuMap.get(record[1]);
          match.push(record.join(outpurtDelimiter));
        } else {
          noMatch.push(record.join(outpurtDelimiter));
        }

        write(item, match, noMatch, data);
      }

      if (match.length > 0 || noMatch.length > 0) {
        write(item, match, noMatch, data, true);
      }

      cleanUpFile(item, data);
    }
  }
}

function write(fileName, match, noMatch, data, lastLine = false) {
  const { outputDir, filePrefix, fileExtension } = data;
  const linesCount = 10000;

  if (lastLine || match.length > linesCount) {
    fs.appendFileSync(
      path.join(outputDir, `${fileName}.replaced`),
      match.join("\n") + "\n"
    );
    match.splice(0, match.length);
  }

  if (lastLine || noMatch.length > linesCount) {
    fs.appendFileSync(
      path.join(outputDir, `${filePrefix}-no-match.${fileExtension}`),
      noMatch.join("\n") + "\n"
    );
    noMatch.splice(0, noMatch.length);
  }
}

function cleanUpFile(fileName, data) {
  const { outputDir } = data;
  fs.unlinkSync(path.join(outputDir, fileName));
  fs.renameSync(
    path.join(outputDir, `${fileName}.replaced`),
    path.join(outputDir, fileName)
  );
}
