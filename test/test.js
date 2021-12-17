const assert = require("assert");
const fs = require("fs-extra");
const yaml = require("js-yaml");
const { expect } = require("chai");
const rewire = require("rewire");
const fileTransformation = rewire("../fileTransformation");

describe("copyInputFilesToOutput", function () {
  it("Given the function receives an input file path as a string and an output file path as a string, it should return with no errors", function () {
    assert.equal(
      fileTransformation.copyInputFilesToOutput(
        "./activity-exchange-file-processing/input-files",
        "./activity-exchange-file-processing/output-files"
      ),
      null
    );
  });
});

// describe("copyOutputFilesToInput", function () {
//   it("Given the function receives an input file path as a string and an output file path as a string, it should return with no errors", function () {
//     assert.equal(
//       fileTransformation.copyOutputFilesToInput(
//         "./activity-exchange-file-processing/input-files-2/",
//         "./activity-exchange-file-processing/output-files/internal"
//       ),
//       null
//     );
//   });
// });

describe("compareFolders", function () {
  it("Given the function receives 2 filepaths as strings, it should return a boolean", function () {
    assert.equal(
      typeof fileTransformation.compareFolders(
        "./activity-exchange-file-processing/output-files/internal/",
        "./activity-exchange-file-processing/input-files"
      ),
      "boolean"
    );
  });
  it("Given the function receives 2 filepaths which contain different files, it should return false", function () {
    assert.equal(
      fileTransformation.compareFolders(
        "./activity-exchange-file-processing/output-file-example/internal",
        "./activity-exchange-file-processing/input-files"
      ),
      false
    );
  });
  it("Given the function receives 2 filepaths which are both in input format and contain the same file data, it should return true", function () {
    assert.equal(
      fileTransformation.compareFolders(
        "./activity-exchange-file-processing/input-files-2",
        "./activity-exchange-file-processing/input-files"
      ),
      true
    );
  });
  it("Given the function receives 2 filepaths which are both in input format and contain different file data, it should return false", function () {
    assert.equal(
      fileTransformation.compareFolders(
        "./activity-exchange-file-processing/input-files-3",
        "./activity-exchange-file-processing/input-files"
      ),
      false
    );
  });
  it("Given the function receives 2 filepaths which are both in output format and contain the same file data, it should return true", function () {
    assert.equal(
      fileTransformation.compareFolders(
        "./activity-exchange-file-processing/output-files-2",
        "./activity-exchange-file-processing/output-files/internal"
      ),
      true
    );
  });
  it("Given the function receives 2 filepaths which are both in output format and contain different file data, it should return false", function () {
    assert.equal(
      fileTransformation.compareFolders(
        "./activity-exchange-file-processing/output-files-example/internal",
        "./activity-exchange-file-processing/output-files/internal"
      ),
      false
    );
  });
  it("Given the function receives 2 filepaths one in input format, one in output format and they contain the same file data, it should return true", function () {
    assert.equal(
      fileTransformation.compareFolders(
        "./activity-exchange-file-processing/input-files-2",
        "./activity-exchange-file-processing/output-files/internal"
      ),
      true
    );
  });
  it("Given the function receives 2 filepaths one in input format, one in output format and they contain different file data, it should return false", function () {
    assert.equal(
      fileTransformation.compareFolders(
        "./activity-exchange-file-processing/input-files-2",
        "./activity-exchange-file-processing/output-files-2"
      ),
      false
    );
  });
});

describe("getFileNames", function () {
  const getFileNames = fileTransformation.__get__("getFileNames");
  it("Given the function receives a directory name as a string it should return an array", function () {
    assert.equal(
      Array.isArray(
        getFileNames("./activity-exchange-file-processing/input-files")
      ),
      true
    );
  });

  it("Given the function receives a directory name as a string it should return all of the files in the directory as an array", function () {
    const result = getFileNames(
      "./activity-exchange-file-processing/input-files"
    );
    expect(result).to.eql([
      "asset1.yaml",
      "asset2.yaml",
      "asset3.yaml",
      "asset4.yaml",
    ]);
  });

  it("Given the function receives a directory name that doesn't exist, it should return an error", function () {
    expect(getFileNames.bind(fileTransformation, "notADirectory")).to.throw(
      "The directory doesn't exist"
    );
  });
});
describe("readFileIntoYamlObject", function () {
  const readFileIntoYamlObject = fileTransformation.__get__(
    "readFileIntoYamlObject"
  );
  it("Given the function receives a file name and a path as strings it should return an array", function () {
    assert.equal(
      Array.isArray(
        readFileIntoYamlObject(
          "./activity-exchange-file-processing/input-files",
          "asset1.yaml"
        )
      ),
      true
    );
  });

  it("Given the function receives a file name and a path as strings it should return its data as an object", function () {
    const result = readFileIntoYamlObject(
      "./activity-exchange-file-processing/input-files",
      "asset1.yaml"
    );
    expect(result).to.eql([
      {
        description: "this is my product",
        productName: "address finder",
        team: "integration",
        filters: {
          asset_type: "REST API",
          deprecated: true,
          visibility: "Internal",
        },
      },
    ]);
  });
});

// describe("writeObjectToFile", function () {
//   const writeObjectToFile = fileTransformation.__get__("writeObjectToFile");
//   it("Given the function receives a valid file as an object with internal visibility, it should run without an error", function () {
//     assert.equal(
//       writeObjectToFile(
//         "---\n" +
//           "deprecated: true\n" +
//           "---\n" +
//           "description: this is my product\n" +
//           "productName: address finder test\n" +
//           "team: integration\n" +
//           "filters:\n" +
//           "  asset_type: REST API\n" +
//           "  deprecated: true\n" +
//           "  visibility: Internal\n",
//         "integration-address-finder-test.yaml",
//         "./activity-exchange-file-processing/output-files/internal/"
//       ),
//       null
//     );
//   });
//   it("Given the function receives a valid file as an object with public visibility, it should run without an error", function () {
//     assert.equal(
//       writeObjectToFile(
//         "---\n" +
//           "deprecated: true\n" +
//           "---\n" +
//           "description: this is my product\n" +
//           "productName: test\n" +
//           "team: integration\n" +
//           "filters:\n" +
//           "  asset_type: REST API\n" +
//           "  deprecated: true\n" +
//           "  visibility: Public\n",
//         "integration-test.yaml",
//         "./activity-exchange-file-processing/output-files/public/"
//       ),
//       null
//     );
//   });
//   it("Given the function receives a valid file as an object , it should write to file with the correct fields", function () {
//     const testObject = fs.readFileSync(
//       "./activity-exchange-file-processing/output-files/internal/integration-address-finder-test.yaml",
//       "utf8"
//     );
//     expect(testObject).to.eql(
//       "---\n" +
//         "deprecated: true\n" +
//         "---\n" +
//         "description: this is my product\n" +
//         "productName: address finder test\n" +
//         "team: integration\n" +
//         "filters:\n" +
//         "  asset_type: REST API\n" +
//         "  deprecated: true\n" +
//         "  visibility: Internal\n",
//       "integration-address-finder-test",
//       "Public",
//       "./activity-exchange-file-processing/output-files"
//     );
//   });
// });

describe("getNewFileName", function () {
  const getNewFileName = fileTransformation.__get__("getNewFileName");
  it("Given the function receives a file as an object, it should return a string", function () {
    assert.equal(
      typeof getNewFileName({
        description: "this is my product",
        productName: "address finder",
        team: "integration",
        filters: {
          asset_type: "REST API",
          deprecated: true,
          visibility: "Public",
        },
      }),
      "string"
    );
  });
  it("Given the function receives a file as an object, it should a new file name in the correct format", function () {
    assert.equal(
      getNewFileName({
        description: "this is my product",
        productName: "address",
        team: "integration",
        filters: {
          asset_type: "REST API",
          deprecated: true,
          visibility: "Public",
        },
      }),
      "integration-address.yaml"
    );
  });
  it("Given the received object has a product name with 2 words, it should a new file name in the correct format", function () {
    assert.equal(
      getNewFileName({
        description: "this is my product",
        productName: "address finder",
        team: "integration",
        filters: {
          asset_type: "REST API",
          deprecated: true,
          visibility: "Public",
        },
      }),
      "integration-address-finder.yaml"
    );
  });

  it("Given the received object has a product name with 3 words, it should a new file name in the correct format", function () {
    assert.equal(
      getNewFileName({
        description: "this is my product",
        productName: "address finder test",
        team: "integration",
        filters: {
          asset_type: "REST API",
          deprecated: true,
          visibility: "Public",
        },
      }),
      "integration-address-finder-test.yaml"
    );
  });

  it("Given the received object has a team with 2 words, it should a new file name in the correct format", function () {
    assert.equal(
      getNewFileName({
        description: "this is my product",
        productName: "address",
        team: "integration test",
        filters: {
          asset_type: "REST API",
          deprecated: true,
          visibility: "Public",
        },
      }),
      "integration-test-address.yaml"
    );
  });

  it("Given the received object has a team with 3 words, it should a new file name in the correct format", function () {
    assert.equal(
      getNewFileName({
        description: "this is my product",
        productName: "address",
        team: "integration test case",
        filters: {
          asset_type: "REST API",
          deprecated: true,
          visibility: "Public",
        },
      }),
      "integration-test-case-address.yaml"
    );
  });

  it("Given the received object has no team, it should return an error", function () {
    expect(
      getNewFileName.bind(fileTransformation, {
        description: "this is my product",
        productName: "address finder",
        filters: {
          asset_type: "REST API",
          deprecated: true,
          visibility: "Public",
        },
      })
    ).to.throw("The file must have a team and a product name");
  });
  it("Given the received object has no productName, it should return an error", function () {
    expect(
      getNewFileName.bind(fileTransformation, {
        description: "this is my product",
        team: "integration",
        filters: {
          asset_type: "REST API",
          deprecated: true,
          visibility: "Public",
        },
      })
    ).to.throw("The file must have a team and a product name");
  });
});

describe("addDeprecation", function () {
  const addDeprecation = fileTransformation.__get__("addDeprecation");
  it("Given the function receives a valid file as an object, it should return a string", function () {
    assert.equal(
      typeof addDeprecation({
        description: "this is my product",
        productName: "address finder test",
        team: "integration",
        filters: {
          asset_type: "REST API",
          deprecated: true,
          visibility: "Public",
        },
      }),
      "string"
    );
  });
  it("Given the function receives a valid file as an object with a deprecation value of true, it should return the object as a string with the deprecation value of true appended to the front in the correct format", function () {
    assert.equal(
      addDeprecation({
        description: "this is my product",
        productName: "address finder test",
        team: "integration",
        filters: {
          asset_type: "REST API",
          deprecated: true,
          visibility: "Public",
        },
      }),
      "---\n" +
        "deprecated: true\n" +
        "---\n" +
        "description: this is my product\n" +
        "productName: address finder test\n" +
        "team: integration\n" +
        "filters:\n" +
        "  asset_type: REST API\n" +
        "  deprecated: true\n" +
        "  visibility: Public\n"
    );
  });
  it("Given the function receives a valid file as an object with a deprecation value of false, it should return the object as a string with the deprecation value of false appended to the front in the correct format", function () {
    assert.equal(
      addDeprecation({
        description: "this is my product",
        productName: "address finder test",
        team: "integration",
        filters: {
          asset_type: "REST API",
          deprecated: false,
          visibility: "Public",
        },
      }),
      "---\n" +
        "deprecated: false\n" +
        "---\n" +
        "description: this is my product\n" +
        "productName: address finder test\n" +
        "team: integration\n" +
        "filters:\n" +
        "  asset_type: REST API\n" +
        "  deprecated: false\n" +
        "  visibility: Public\n"
    );
  });
  it("Given the function receives a valid file as an object with no deprecation value, it should return the object as a string with the deprecation value of false appended to the front in the correct format", function () {
    assert.equal(
      addDeprecation({
        description: "this is my product",
        productName: "address finder test",
        team: "integration",
        filters: {
          asset_type: "REST API",
          visibility: "Public",
        },
      }),
      "---\n" +
        "deprecated: false\n" +
        "---\n" +
        "description: this is my product\n" +
        "productName: address finder test\n" +
        "team: integration\n" +
        "filters:\n" +
        "  asset_type: REST API\n" +
        "  visibility: Public\n"
    );
  });
});

describe("getInputFilename", function () {
  const getInputFilename = fileTransformation.__get__("getInputFilename");
  it("Given the function receives an array of filenames as strings, it should return a string", function () {
    assert.equal(
      typeof getInputFilename(["asset1.yaml", "asset2.yaml"]),
      "string"
    );
  });
  it("Given the function receives an array of filenames as strings, it should return a new filename as string with the string being in the format 'asset[number].yaml' ", function () {
    assert.equal(
      getInputFilename(["asset1.yaml", "asset2.yaml"]),
      "asset3.yaml"
    );
  });
  it("Given the function receives an empty array , it should return a new filename as string with the string being 'asset1.yaml' ", function () {
    assert.equal(getInputFilename([]), "asset1.yaml");
  });
});

describe("createDirectory", function () {
  const createDirectory = fileTransformation.__get__("createDirectory");
  it("Given the function receives a filepath as a string, it should run without errors ", function () {
    assert.equal(
      createDirectory("./activity-exchange-file-processing/new-input-files"),
      null
    );
  });
  it("Given the function receives a filepath as a string, it should create a folder using the directory at the end of the path as a name ", function () {
    createDirectory("./activity-exchange-file-processing/new-input-files-test");
    let folderName;
    fs.readdirSync("./activity-exchange-file-processing").forEach((file) => {
      if (file === "new-input-files-test") {
        folderName = file;
      }
    });
    assert.equal(folderName, "new-input-files-test");
  });
});

describe("getFilepath", function () {
  const getFilepath = fileTransformation.__get__("getFilepath");
  it("Given the function receives a valid file as an object with a valid visibility, it should return a string", function () {
    assert.equal(
      typeof getFilepath(
        "./activity-exchange-file-processing/output-files",
        "Internal"
      ),
      "string"
    );
  });
  it("Given the function receives an Internal visibility, it should return the internal filepath as a string", function () {
    assert.equal(
      getFilepath(
        "./activity-exchange-file-processing/output-files",
        "Internal"
      ),
      "./activity-exchange-file-processing/output-files/internal/"
    );
  });
  it("Given the function receives a Public visibility, it should return the public filepath as a string", function () {
    assert.equal(
      getFilepath("./activity-exchange-file-processing/output-files", "Public"),
      "./activity-exchange-file-processing/output-files/public/"
    );
  });
  it("Given the function receives a null visibility, it should return an error", function () {
    expect(
      getFilepath.bind(
        fileTransformation,
        "./activity-exchange-file-processing/output-files",
        null
      )
    ).to.throw("Visibility not found");
  });
});

describe("readFile", function () {
  const readFile = fileTransformation.__get__("readFile");
  it("Given the function receives a file name and a path as strings it should return a string", function () {
    assert.equal(
      typeof readFile(
        "./activity-exchange-file-processing/input-files",
        "asset1.yaml"
      ),
      "string"
    );
  });
  it("Given the function receives a file name and a path as strings it should the file data as a string", function () {
    assert.equal(
      readFile(
        "./activity-exchange-file-processing/input-files",
        "asset1.yaml"
      ),
      'description: "this is my product"\n' +
        "team: integration\n" +
        "productName: address finder\n" +
        "filters: #filter options\n" +
        '  asset_type: "REST API"\n' +
        "  deprecated: true\n" +
        '  visibility: "Internal"\n'
    );
  });
});
