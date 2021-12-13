const fs = require("fs-extra");
const yaml = require("js-yaml");
const inputFolder = "./activity-exchange-file-processing/input-files";
const outputFolder = "./activity-exchange-file-processing/output-files";

const getFileNames = (folder) => {
  const inputFiles = [];
  fs.readdirSync(folder).forEach((file) => {
    inputFiles.push(file);
  });
  if (inputFiles.length === 0) {
    throw new Error("The directory is empty");
  }
  return inputFiles;
};

const readFile = (filename) => {
  const data = yaml.load(
    fs.readFileSync(
      "./activity-exchange-file-processing/input-files/" + filename,
      "utf8"
    )
  );
  return data;
};

const copyFile = (file) => {
  if (
    file.filters.visibility === "Internal" ||
    file.filters.visibility === "Public"
  ) {
    fs.writeFile(
      outputFolder + "/internal/asset1.yaml",
      yaml.dump(file),
      function () {}
    );
  }
  if (file.filters.visibility === "Public") {
    fs.writeFile(
      outputFolder + "/public/asset1.yaml",
      yaml.dump(file),
      function () {}
    );
  } else {
    throw new Error("Visibility not found");
  }
};

module.exports = {};
