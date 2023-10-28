import fs from "fs";
import path from "path";

export function joinerOptions() {
  const data = {
    inputDir: "",
    outputDir: "",
    outputFileName: "",
    inputDelimiter: "",
    outpurtDelimiter: "",
    bucketsCount: "",
    lookupFile: "",
  };

  const makeLine = (name, prompt, options, defaultValue) => ({
    prompt,
    options,
    defaultValue,
    cb: (value) => {
      data[name] = value;
    },
  });

  const getLookupFile = () => {
    const items = fs.readdirSync(data.inputDir);

    for (const item of items) {
      if (
        items.filter((i) => i === item).length === 1 &&
        fs.statSync(path.join(data.inputDir, item)).isFile()
      ) {
        return path.join(data.inputDir, item);
      }
    }

    return null;
  };

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
    yield makeLine("bucketsCount", "Output files number", null, 10);
    yield makeLine("lookupFile", "Lookup file", null, getLookupFile());
  })();

  return { options, data };
}
