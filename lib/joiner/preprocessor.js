import fs from "fs";
import { Transform } from "stream";

export async function preprocessFiles(data) {
  const { inputDir, outputDir, inputDelimiter, filePrefix, tmpSuffix } = data;
  const promises = [];

  for (const item of fs.readdirSync(inputDir)) {
    if (
      (inputDir !== outputDir || !item.startsWith(filePrefix)) && // skip output files
      !item.endsWith(tmpSuffix) && // skip already preprocessed files
      fs.statSync(`${inputDir}/${item}`).isFile()
    ) {
      const readStram = fs.createReadStream(`${inputDir}/${item}`);
      const writeStream = fs.createWriteStream(
        `${inputDir}/${item}${tmpSuffix}`
      );

      readStram.pipe(filePreporcessor(data)).pipe(writeStream);

      promises.push(
        new Promise((resolve, reject) => {
          writeStream.on("finish", () => {
            resolve("ok");
          });
        })
      );
    }
  }

  return Promise.all(promises);
}

export function cleanUpFiles(data) {
  const { inputDir, tmpSuffix } = data;

  for (const item of fs.readdirSync(inputDir)) {
    if (
      item.endsWith(tmpSuffix) &&
      fs.statSync(`${inputDir}/${item}`).isFile()
    ) {
      fs.unlinkSync(`${inputDir}/${item}`);
    }
  }
}

function filePreporcessor(data) {
  const { inputDelimiter } = data;

  const replaceQuoteRegex = new RegExp(
    String.raw`(["\\]${inputDelimiter}|${inputDelimiter}["\\])`,
    "g"
  );

  const escapedNewLineRegex = new RegExp(String.raw`\\\n`, "g");

  return new Transform({
    transform(chunk, encoding, callback) {
      const processedChunk = chunk
        .toString()
        .replaceAll(replaceQuoteRegex, inputDelimiter)
        .replaceAll(escapedNewLineRegex, " ")
        .replaceAll('|', ';');
      this.push(processedChunk);
      callback();
    },
  });
}
