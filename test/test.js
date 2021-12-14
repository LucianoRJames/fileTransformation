const assert = require("assert");
const fs = require("fs-extra");
const yaml = require("js-yaml");
const { expect } = require("chai");
const rewire = require("rewire");
const fileTransformation = rewire("../fileTransformation");

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

  it("Given the function receives a directory that contains no files, it should return an error", function () {
    expect(
      getFileNames.bind(
        fileTransformation,
        "./activity-exchange-file-processing/input-files-test"
      )
    ).to.throw("The directory is empty");
  });
});
describe("readFileIntoYamlObject", function () {
  const readFileIntoYamlObject = fileTransformation.__get__(
    "readFileIntoYamlObject"
  );
  it("Given the function receives a file name as a string it should return an object", function () {
    assert.equal(typeof readFileIntoYamlObject("asset1.yaml"), "object");
  });

  it("Given the function receives a file name as a string it should return its data as an object", function () {
    const result = readFileIntoYamlObject("asset1.yaml");
    expect(result).to.eql({
      description: "this is my product",
      productName: "address finder",
      team: "integration",
      filters: {
        asset_type: "REST API",
        deprecated: true,
        visibility: "Internal",
      },
    });
  });
});

describe("writeObjectToFile", function () {
  const writeObjectToFile = fileTransformation.__get__("writeObjectToFile");
  it("Given the function receives a valid file as an object with internal visibility, it should run without an error", function () {
    assert.equal(
      writeObjectToFile(
        "---\n" +
          "deprecated: true\n" +
          "---\n" +
          "description: this is my product\n" +
          "productName: address finder test\n" +
          "team: integration\n" +
          "filters:\n" +
          "  asset_type: REST API\n" +
          "  deprecated: true\n" +
          "  visibility: Internal\n",
        "integration-address-finder-test",
        "Internal",
        "./activity-exchange-file-processing/output-files"
      ),
      null
    );
  });

  it("Given the function receives a file without visibility, it should return an error", function () {
    expect(
      writeObjectToFile.bind(
        fileTransformation,
        "---\n" +
          "deprecated: true\n" +
          "---\n" +
          "description: this is my product\n" +
          "productName: address finder test\n" +
          "team: integration\n" +
          "filters:\n" +
          "  asset_type: REST API\n" +
          "  deprecated: true\n" +
          "integration-address-finder-test",
        null,
        "./activity-exchange-file-processing/output-files"
      )
    ).to.throw("Visibility not found");
  });

  it("Given the function receives a valid file as an object with public visibility, it should run without an error", function () {
    assert.equal(
      writeObjectToFile(
        "---\n" +
          "deprecated: true\n" +
          "---\n" +
          "description: this is my product\n" +
          "productName: address finder test\n" +
          "team: integration\n" +
          "filters:\n" +
          "  asset_type: REST API\n" +
          "  deprecated: true\n" +
          "  visibility: Public\n",
        "integration-address-finder-test",
        "Public",
        "./activity-exchange-file-processing/output-files"
      ),
      null
    );
  });

  // it("Given the function receives a valid file as an object , it should write to file with the correct fields", function () {
  //   const testObject = fs.readFileSync(
  //     "./activity-exchange-file-processing/output-files/internal/integration-address-finder-test.yaml",
  //     "utf8"
  //   );

  //   expect(testObject).to.eql(
  //     "---\n" +
  //       "deprecated: true\n" +
  //       "---\n" +
  //       "description: this is my product\n" +
  //       "productName: address finder test\n" +
  //       "team: integration\n" +
  //       "filters:\n" +
  //       "  asset_type: REST API\n" +
  //       "  deprecated: true\n" +
  //       "  visibility: Public\n",
  //     "integration-address-finder-test",
  //     "Public",
  //     "./activity-exchange-file-processing/output-files"
  //   );
  // });
});

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

describe("fileTransformation", function () {
  it("If the function receives an input file path as a string and an output file path as a string, it should return with no errors", function () {
    assert.equal(
      fileTransformation.fileTransformation(
        "./activity-exchange-file-processing/input-files",
        "./activity-exchange-file-processing/output-files"
      ),
      null
    );
  });
});
