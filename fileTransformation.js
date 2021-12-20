const fs = require("fs-extra");
const yaml = require("js-yaml");
const inputFolder = "./activity-exchange-file-processing/input-files";
const outputFolder = "./activity-exchange-file-processing/output-files";

const copyInputFilesToOutput = (inputFolder, outputFolder) => {
  const fileNames = getFileNames(inputFolder);
  fileNames.forEach((filename) => {
    const fileAsObject = readFileIntoYamlObject(inputFolder, filename)[0];
    const updatedFileName = getNewFileName(fileAsObject);
    const visibility = fileAsObject.filters.visibility;
    const depricatedFile = addDeprecation(fileAsObject);
    let outputPath = getFilepath(outputFolder, visibility);
    if (visibility === "Public") {
      writeObjectToFile(depricatedFile, updatedFileName, outputPath);
      outputPath = getFilepath(outputFolder, "Internal");
    }
    writeObjectToFile(depricatedFile, updatedFileName, outputPath);
  });
};

const copyOutputFilesToInput = (inputDirectory, outputDirectory) => {
  const fileNames = getFileNames(outputDirectory);
  createDirectory(inputDirectory);
  fileNames.forEach((filename) => {
    const inputFiles = getFileNames(inputDirectory);
    const fileAsObject = readFileIntoYamlObject(outputDirectory, filename)[1];
    const updatedFileName = getInputFilename(inputFiles);
    writeObjectToFile(yaml.dump(fileAsObject), updatedFileName, inputDirectory);
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
  return inputFiles;
};

const readFileIntoYamlObject = (filepath, filename) => {
  const data = yaml.loadAll(fs.readFileSync(filepath + "/" + filename, "utf8"));
  return data;
};

const writeObjectToFile = (file, filename, outputPath) => {
  fs.writeFileSync(outputPath + filename, file, function () {});
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

const createDirectory = (filepath) => {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }
};

const getFilepath = (outputPath, visibility) => {
  try {
    return outputPath + "/" + visibility.toLowerCase() + "/";
  } catch {
    throw new Error("Visibility not found");
  }
};
const compareFolders = (filepath1, filepath2) => {
  const folder1FileNames = getFileNames(filepath1);
  const folder2FileNames = getFileNames(filepath2);
  const folder1FilesAsObjects = [];
  const folder2FilesAsObjects = [];
  folder1FileNames.forEach((filename) => {
    folder1FilesAsObjects.push(readFile(filepath1, filename));
  });
  folder2FileNames.forEach((filename) => {
    folder2FilesAsObjects.push(readFile(filepath2, filename));
  });

  let equivalent = false;
  let folder1FilesAsString = JSON.stringify(folder1FilesAsObjects);
  let folder2FilesAsString = JSON.stringify(folder2FilesAsObjects);
  folder1FilesAsString = folder1FilesAsString.replace(
    /deprecated: true|deprecated: false|---/g,
    ""
  );
  folder2FilesAsString = folder2FilesAsString.replace(
    /deprecated: true|deprecated: false|---/g,
    ""
  );
  folder1FilesAsObjects = JSON.parse(folder1FilesAsString);
  folder2FilesAsObjects = JSON.parse(folder2FilesAsString);
  folder1FilesAsObjects.sort();
  folder2FilesAsObjects.sort();
  folder1FilesAsString = JSON.stringify(folder1FilesAsObjects);
  folder2FilesAsString = JSON.stringify(folder2FilesAsObjects);
  //removing whitespace, \n, comments and \ from the strings
  let fileParsingRegex = /#[\w|\d|\s]+\\n|\\n|\\|"|\s/g;
  folder1FilesAsString = folder1FilesAsString.replace(fileParsingRegex, "");
  folder2FilesAsString = folder2FilesAsString.replace(fileParsingRegex, "");
  if (folder1FilesAsString === folder2FilesAsString) {
    equivalent = true;
  }
  return equivalent;
};

const readFile = (filepath, filename) => {
  return fs.readFileSync(filepath + "/" + filename, "utf8");
};

module.exports = {
  copyInputFilesToOutput,
  copyOutputFilesToInput,
  compareFolders,
};
