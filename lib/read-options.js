import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import "colors";

export async function readOptions(questions) {
  const rl = readline.createInterface({ input, output });
  const answers = {};

  for (const { prompt, options, defaultValue, cb } of questions) {
    const useIndex = useIndexNumbers(options);
    const qustionText = `${prompt} (${getOptionsText(
      options
    )})${getDefaultValueText(defaultValue)} : `.magenta;
    const answer = await rl.question(qustionText);
    const value =
      answer === ""
        ? defaultValue
        : useIndex &&
          getAnswerIndexes(options).includes(Number.parseInt(answer, 10))
        ? options[answer]
        : answer;
    console.log(`Selected: ${value}`.green);
    cb(value);
  }

  rl.close();
  return answers;
}

function getOptionsText(options) {
  const useIndex = useIndexNumbers(options);

  if (Array.isArray(options)) {
    return options
      .map((v) => (v === null ? "your option" : `'${v}'`))
      .map((v, i) => (useIndex ? `${i}. ${v}` : v))
      .join(", ");
  }

  return options === null ? "Your option" : options;
}

function getDefaultValueText(defaults) {
  return defaults ? `, default - '${defaults}'` : "";
}

function useIndexNumbers(options) {
  if (!Array.isArray(options)) {
    options = [options];
  }

  return !options.includes(null) && options.length > 1;
}

function getAnswerIndexes(options) {
  if (!Array.isArray(options)) {
    options = [options];
  }

  return options.map((v, i) => i);
}
