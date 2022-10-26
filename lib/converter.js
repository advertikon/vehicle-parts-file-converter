import fs from 'fs';

export async function Converter(fileName) {
    if (!fs.existsSync(fileName)) {
        throw new Error(`file ${fileName} does not exist`);
    }
    console.log(fileName)
}
