import "colors";
import { Converter } from "../lib/converter/converter.js";
import { readOptions } from "../lib/read-options.js";
import { convertOptions } from "../lib/converter/options.js";

export function convertCommand(program) {
  program
    .command("convert <file-name>")
    .description("Convert file to proper format")
    .action(async (fileName) => {
      const {data, options} = convertOptions(fileName);
      await readOptions(options);
      const {namespace, separatorIn, separatorOut, outDir} = data
      await Converter(
        fileName,
        namespace,
        separatorIn,
        separatorOut,
        outDir
      ).catch((e) => console.error(`Error: ${e.message}`.red));
    });
}
