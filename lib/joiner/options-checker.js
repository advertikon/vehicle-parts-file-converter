import fs from 'fs';

export function OptionsChecker(options) {
    const { inputDir, outputDir, lookupFile } = options;

    if (!fs.existsSync(inputDir)) {
        throw new Error(`Input directory '${inputDir}' does not exist`);
    }

    if (!fs.existsSync(outputDir)) {
        throw new Error(`Output directory '${outputDir}' does not exist`);
    }

    if (!fs.existsSync(lookupFile)) {
        throw new Error(`Lookup file '${lookupFile}' does not exist`);
    }
}