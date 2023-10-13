import "colors";
import { Converter } from "../lib/converter/converter.js";
import { readOptions } from "../lib/read-options.js";
import path from "path";

const options = [
  [
    "namespace",
    "Select a namespace",
    ["sema", "custom-fitment", "dci"],
    "sema",
  ],
  ["separatorIn", "Input file delimiter", [",", "|", null], "|"],
  ["separatorOut", "Output file delimiter", [",", "|"], "|"],
  ["outDir", "Directory to store output file", null, "."],
];

export function convertCommand(program) {
  program
    .command("convert <file-name>")
    .description("Convert file to proper format")
    .action(async (fileName) => {
      options[3][3] = path.dirname(fileName); // save output to the same dir as the input file (.)
      const { separatorIn, separatorOut, namespace, outDir } =
        await readOptions(options);
      await Converter(
        fileName,
        namespace,
        separatorIn,
        separatorOut,
        outDir
      ).catch((e) => console.error(`Error: ${e.message}`.red));
    });
}
