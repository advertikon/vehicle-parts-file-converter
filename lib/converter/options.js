import path from "path";

export function convertOptions(fileName) {
  const data = {
    namespace: "",
    separatorIn: "",
    separatorOut: "",
    outDir: "",
  };

  const makeLine = (name, prompt, options, defaultValue) => ({
    prompt,
    options,
    defaultValue,
    cb: (value) => {
      data[name] = value;
    },
  });

  const options = (function* () {
    yield makeLine(
      "namespace",
      "Select a namespace",
      ["sema", "custom-fitment", "dci"],
      "sema"
    );
    yield makeLine(
      "separatorIn",
      "Input file delimiter",
      [",", "|", null],
      "|"
    );
    yield makeLine("separatorOut", "Output file delimiter", [",", "|"], "|");
    yield makeLine(
      "outDir",
      "Directory to store output file",
      null,
      path.dirname(fileName)
    );
  })();

  return { options, data };
}
