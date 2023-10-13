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
  ["inputDelimiter", "Select a delimiter for input files", [",", "|", "\t"], ","],
  ["outpurtDelimiter", "Select a delimiter for output files", [",", "|", "\t"], "|"],
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

      await Joiner(data).catch((e) => {
        console.error(`Error: ${e} in ${e.filename} at ${e.lineNumber}`.red)
        console.error(e.stack);
      });
    });
}
