import { parse } from "csv-parse";
import fs from "fs";
import path from "path";

export async function duplicateFitmentNotes(data) {
  const { outputDir, filePrefix, outpurtDelimiter } = data;

  for (const item of fs.readdirSync(outputDir)) {
    if (item.startsWith(filePrefix)) {
      let header;
      let lines = [];
      console.log(`Duplicating '${item}'...`.green);

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
          lines.push(record.join(outpurtDelimiter));
          continue;
        }

        record[11] = "";
        lines.push(record.join(outpurtDelimiter));

        if (lines.length > 10000) {
          write(item, lines, data);
          lines = [];
        }
      }

      if (lines.length > 0) {
        write(item, lines, data);
        lines = [];
      }
    }
  }
}

function write(file, records, data) {
  const { outputDir, outpurtDelimiter } = data;

  fs.appendFileSync(
    path.join(outputDir, file.replace(/\.([^.]+)$/, "-no-fitement-notes.$1")),
    records.join("\n") + "\n"
  );
}
