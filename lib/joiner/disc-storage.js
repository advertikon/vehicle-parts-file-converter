import path from "path";
import fs from "fs";
import _ from "lodash";
import { csvHeader, getBucket, semaFieldIndex } from "../util.js";

export function prepareBuckets(data) {
  const {
    outputDir,
    outpurtDelimiter,
    bucketsCount,
    filePrefix,
    fileExtension,
  } = data;

  for (const item of fs.readdirSync(outputDir)) {
    if (item.startsWith(filePrefix)) {
      fs.unlinkSync(path.join(outputDir, item));
    }
  }

  for (let i = 0; i < bucketsCount; i++) {
    const bucketFileName = `${filePrefix}${i}.${fileExtension}`;

    fs.writeFileSync(
      path.join(outputDir, bucketFileName),
      csvHeader.join(outpurtDelimiter) + "\n"
    );
  }
}

export function StorageWrite(lines, data) {
  const {
    outputDir,
    outpurtDelimiter,
    bucketsCount,
    filePrefix,
    fileExtension,
  } = data;

  const skuIndex = semaFieldIndex("Part");
  const grouped = _.groupBy(lines, (line) => {
    try {
      return getBucket(bucketsCount, line[skuIndex]);
    } catch (e) {
      console.log(line);
      throw e;
    }
  });

  for (const [backet, group] of Object.entries(grouped)) {
    const bucketFileName = `${filePrefix}${backet}.${fileExtension}`;

    fs.appendFileSync(
      path.join(outputDir, bucketFileName),
      group.map((line) => line.join(outpurtDelimiter)).join("\n") + "\n"
    );
  }
}
