import readline from "node:readline/promises";
import {stdin as input, stdout as output} from "node:process";

export async function readOptions(questions) {
    const rl = readline.createInterface({ input, output });
    const answers = {};

    for(const question of questions) {
        const useIndex = useIndexNumbers(question[2]);
        const answer = await rl.question(`${question[1]} (${getOptionsText(question[2])})${getDefaultValueText(question[3])} : `.blue);
        const value = answer === '' ? question[3] : (useIndex && getAnswerIndexes(question[2]).includes(Number.parseInt(answer, 10)) ? question[2][answer] : answer);
        console.log(`Selected: ${value}`.green);
        answers[question[0]] = value;
    }

    rl.close();
    return answers;
}

function getOptionsText(options) {
    const useIndex = useIndexNumbers(options);

    if (Array.isArray(options)) {
        return options.map(v => v === null ? 'your option' : `'${v}'`)
            .map((v, i) => useIndex ? `${i}. ${v}` : v)
            .join(', ');
    }

    return options === null ? 'Your option' : options;
}

function getDefaultValueText(defaults) {
    return defaults ? `, default - '${defaults}'` : '';
}

function useIndexNumbers(options) {
    if (!Array.isArray(options)) {
        options = [options];
    }

    return !options.includes(null) && options.length > 1 && options.find(o => o.length > 1);
}

function getAnswerIndexes(options) {
    if (!Array.isArray(options)) {
        options = [options];
    }

    return options.map((v, i) => i);
}

