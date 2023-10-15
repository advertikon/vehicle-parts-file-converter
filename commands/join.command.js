import { readOptions } from "../lib/read-options.js";
import { OptionsChecker } from "../lib/joiner/options-checker.js";
import { Joiner } from "../lib/joiner/joiner.js";

// [value name, question text, options, default value]
const options = [
  ["inputDir", "Select a directory to join files from", null, process.cwd()],
  [
    "outputDir",
    "Select a directory to save joined files to",
    null,
    process.cwd(),
  ],
  ["outputFileName", "Select a name for the joined file", null, "joined.csv"],
  [
    "inputDelimiter",
    "Select a delimiter for input files",
    [",", "|", "tab"],
    "tab",
  ],
  [
    "outpurtDelimiter",
    "Select a delimiter for output files",
    [",", "|", "tab"],
    "|",
  ],
  ["bucketsCount", "Output files number", null, 10],
];

export function joinCommand(program) {
  program
    .command("join")
    .description("Join files in a directory")
    .action(async () => {
      const data = await readOptions(options);

      try {
        OptionsChecker(data);
      } catch (e) {
        console.error(`Error: ${e.message}`.red);
        return;
      }

      if (data.inputDelimiter === "tab") {
        data.inputDelimiter = "\t";
      }

      if (data.outpurtDelimiter === "tab") {
        data.outpurtDelimiter = "\t";
      }

      const fileMatch = data.outputFileName.match(
        /^(?<prefix>[^.]+)\.(?<extension>.+)$/
      );

      if (!fileMatch) {
        console.error(`Error: invalid filename ${data.filename}`.red);
        return;
      }

      data.filePrefix = `${fileMatch.groups.prefix}-`;
      data.fileExtension = fileMatch.groups.extension;
      data.tmpSuffix = ".tmp";
      data.unorderedSuffix = ".unordered";

      await Joiner(data).catch((e) => {
        console.error(`Error: ${e}`.red);
        console.error(e.stack);
      });
    });
}
