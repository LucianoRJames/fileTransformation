const fs = require("fs-extra");
const yaml = require("js-yaml");
const inputFolder = "./activity-exchange-file-processing/input-files";

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

module.exports = {};
