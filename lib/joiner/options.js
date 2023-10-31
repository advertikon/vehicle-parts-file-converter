import fs from "fs";
import path from "path";

export function joinerOptions() {
  const data = {
    inputDir: "",
    outputDir: "",
    outputFileName: "",
    inputDelimiter: "",
    outpurtDelimiter: "",
    bucketsCount: 1,
    lookupFile: "",
    noMatchCount: 1
  };

  const makeLine = (name, prompt, options, defaultValue) => ({
    prompt,
    options,
    defaultValue,
    cb: (value) => {
      data[name] = value;
    },
  });

  const getLookupFiles = () => {
    const items = fs.readdirSync(data.inputDir);
    const files = [];

    for (const item of items) {
      if (
        !item.startsWith('.') &&
        items.filter((i) => i === item).length === 1 &&
        fs.statSync(path.join(data.inputDir, item)).isFile()
      ) {
        files.push(path.join(data.inputDir, item));
      }
    }

    return files.length > 0 ? files : null;
  };

  const getBucketsCount = () => {
    const items = fs.readdirSync(data.inputDir);
    let counts = {};

    for (const item of items) {
      if (
        !item.startsWith('.') &&
        fs.statSync(path.join(data.inputDir, item)).isFile()
      ) {
        counts[item] = (counts[item] || 0) + 1;
      }
    }

    return Math.max(...Object.values(counts));
  }

  const options = (function* () {
    yield makeLine(
      "inputDir",
      "Select a directory to join files from",
      null,
      process.cwd()
    );
    yield makeLine(
      "outputDir",
      "Select a directory to save joined files to",
      null,
      process.cwd()
    );
    yield makeLine(
      "outputFileName",
      "Select a name for the joined file",
      null,
      "joined.csv"
    );
    yield makeLine(
      "inputDelimiter",
      "Select a delimiter for input files",
      [",", "|", "tab"],
      "tab"
    );
    yield makeLine(
      "outpurtDelimiter",
      "Select a delimiter for output files",
      [",", "|", "tab"],
      "|"
    );
    yield makeLine("bucketsCount", "Output files number", null, getBucketsCount());
    yield makeLine("noMatchCount", "No match files number", null, Math.max(1, Math.ceil(data.bucketsCount / 5)));
    const lookupFiles = getLookupFiles();
    yield makeLine("lookupFile", "Lookup file", lookupFiles, lookupFiles ? lookupFiles[0] : null);
  })();

  return { options, data };
}
