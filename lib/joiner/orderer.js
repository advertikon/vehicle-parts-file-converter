import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import { semaFieldIndex } from "../util.js";
import _ from "lodash";
import "colors";

export async function OrderSkus(data) {
  const {
    outputDir,
    filePrefix,
    fileExtension,
    unorderedSuffix,
    outpurtDelimiter,
  } = data;
  const fileNameRegex = new RegExp(
    String.raw`^${filePrefix}\d+\.${fileExtension}$`
  );

  const files = fs.readdirSync(outputDir).filter((file) => {
    return file.match(fileNameRegex);
  });

  for (const item of files) {
    console.log(`Ordering items of file '${item}'...`.green);
    const unorderedFileName = `${item}${unorderedSuffix}`;
    let isFirstChunk = true;

    const stat = await getStats(item, data);

    if (stat.size === 0) {
      console.log(`File '${item}' is empty. Skipping...`.yellow);
      continue;
    }

    const chunks = [];
    let currentChunk = [];
    let currentChunkSize = 0;

    stat.forEach((count, sku) => {
      currentChunk.push(sku);
      currentChunkSize += count;

      if (currentChunkSize > 300000) {
        chunks.push(currentChunk);
        currentChunk = [];
        currentChunkSize = 0;
      }
    });

    if (currentChunk.length) {
      chunks.push(currentChunk);
    }

    fs.renameSync(
      path.join(outputDir, item),
      path.join(outputDir, unorderedFileName)
    );

    for (const chunk of chunks) {
      let records = [];
      let header = null;
      const parser = fs
        .createReadStream(path.join(outputDir, unorderedFileName))
        .pipe(
          parse({
            delimiter: outpurtDelimiter,
            quote: null,
            relaxQuotes: true,
          })
        );

      const map = new Map();
      chunk.forEach((sku) => {
        map.set(sku, true);
      });

      for await (const record of parser) {
        if (!header) {
          header = record;
          continue;
        }

        const currentSku = record[semaFieldIndex("Part")];

        if (map.get(currentSku)) {
          records.push(record);
        } else {
          continue;
        }
      }

      const sortedRecords = _.sortBy(records, (record) => {
        return record[semaFieldIndex("Part")];
      });

      if (isFirstChunk) {
        isFirstChunk = false;
        fs.writeFileSync(
          path.join(outputDir, item),
          header.join(outpurtDelimiter) + "\n"
        );
      }

      write(item, sortedRecords, data);
    }

    fs.unlinkSync(path.join(outputDir, unorderedFileName));
  }
}

async function getStats(file, data) {
  const { outputDir, outpurtDelimiter } = data;

  let header = null;
  const stat = new Map();

  const parser = fs.createReadStream(path.join(outputDir, file)).pipe(
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
      continue;
    }

    const currentSku = record[semaFieldIndex("Part")];

    if (!stat.has(currentSku)) {
      stat.set(currentSku, 0);
    } else {
      stat.set(currentSku, stat.get(currentSku) + 1);
    }
  }

  return stat;
}

function write(fileName, lines, data) {
  const { outputDir, outpurtDelimiter } = data;

  fs.appendFileSync(
    path.join(outputDir, fileName),
    lines.map((line) => line.join(outpurtDelimiter)).join("\n") + "\n"
  );
}
