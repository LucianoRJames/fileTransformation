const fs = require("fs-extra");
const yaml = require("js-yaml");
const inputFolder = "./activity-exchange-file-processing/input-files";
const outputFolder = "./activity-exchange-file-processing/output-files";

const copyInputFilesToOutput = (inputFolder, outputFolder) => {
  const fileNames = getFileNames(inputFolder);
  fileNames.forEach((filename) => {
    const fileAsObject = readFileIntoYamlObject(filename);
    const updatedFileName = getNewFileName(fileAsObject);
    const visibility = fileAsObject.filters.visibility;
    const depricatedFile = addDeprecation(fileAsObject);
    writeObjectToFile(
      depricatedFile,
      updatedFileName,
      visibility,
      outputFolder
    );
  });
};

const copyOutputFilesToInput = (inputFolder, outputFolder) => {
  const fileNames = getFileNames(outputFolder);
  fileNames.forEach((filename) => {
    const inputFiles = getFileNames(inputFolder);
    const fileAsObject = readFileIntoYamlObject(filename);
    const updatedFileName = getInputFilename(inputFiles);
    const undepricatedFile = removeDeprecation(fileAsObject);
    writeObjectToFile(undepricatedFile, updatedFileName, inputFolder);
  });
};

const getFileNames = (folder) => {
  const inputFiles = [];
  try {
    fs.readdirSync(folder).forEach((file) => {
      inputFiles.push(file);
    });
  } catch {
    throw new Error("The directory doesn't exist");
  }
  if (inputFiles.length === 0) {
    throw new Error("The directory is empty");
  }
  return inputFiles;
};

const readFileIntoYamlObject = (filename) => {
  const data = yaml.load(
    fs.readFileSync(
      "./activity-exchange-file-processing/input-files/" + filename,
      "utf8"
    )
  );
  return data;
};

const writeObjectToFile = (file, filename, visibility, outputPath) => {
  if (visibility === "Public") {
    fs.writeFile(outputPath + "/public/" + filename, file, function () {});
  }
  if (visibility === "Internal" || visibility === "Public") {
    fs.writeFile(outputPath + "/internal/" + filename, file, function () {});
  } else {
    throw new Error("Visibility not found");
  }
};

const getNewFileName = (file) => {
  if (file.team && file.productName) {
    return (
      file.team.split(" ").join("-") +
      "-" +
      file.productName.split(" ").join("-") +
      ".yaml"
    );
  } else {
    throw new Error("The file must have a team and a product name");
  }
};
const addDeprecation = (file) => {
  const fileByLine = yaml.dump(file).split("\n");

  fileByLine.unshift("---");
  if (file.filters.deprecated) {
    fileByLine.unshift("deprecated: " + file.filters.deprecated);
  } else {
    fileByLine.unshift("deprecated: false");
  }
  fileByLine.unshift("---");
  return fileByLine.join("\n");
};

const getInputFilename = (filenames) => {
  let newFileName;
  const numberRegex = /[0-9]+/;
  filenames = filenames.sort();
  if (filenames.length === 0) {
    newFileName = "asset1.yaml";
  } else {
    const filenumber = filenames[filenames.length - 1].match(numberRegex);
    newFileName = "asset" + (parseInt(filenumber) + 1) + ".yaml";
  }
  return newFileName;
};

const removeDeprecation = (file) => {
  const endIndexOfDeprecation = 3;
  let fileByLine = file.split("\n");
  fileByLine = fileByLine.splice(endIndexOfDeprecation, fileByLine.length - 1);
  return fileByLine.join("\n");
};

const createDirectory = (filepath) => {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }
};

module.exports = {
  copyInputFilesToOutput,
};
