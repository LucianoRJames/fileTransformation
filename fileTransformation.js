const fs = require("fs-extra");
const yaml = require("js-yaml");
const inputFolder = "./activity-exchange-file-processing/input-files";

const getFileNames = (folder) => {
  const inputFiles = [];
  fs.readdirSync(folder).forEach((file) => {
    inputFiles.push(file);
  });
  return inputFiles;
};

module.exports = {
  getFileNames,
};
