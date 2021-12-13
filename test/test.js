const assert = require("assert");
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
      "ENOENT: no such file or directory, scandir 'notADirectory'"
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
describe("readFile", function () {
  const readFile = fileTransformation.__get__("readFile");
  it("Given the function receives a file name as a string it should return an object", function () {
    assert.equal(typeof readFile("asset1.yaml"), "object");
  });

  it("Given the function receives a file name as a string it should return its data as an object", function () {
    const result = readFile("asset1.yaml");
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

describe("copyFile", function () {
  const copyFile = fileTransformation.__get__("copyFile");
  it("Given the function receives a valid file as an object with internal visibility, it should run without an error", function () {
    assert.equal(
      copyFile({
        description: "this is my product",
        productName: "internal product",
        team: "integration",
        filters: {
          asset_type: "REST API",
          deprecated: true,
          visibility: "Internal",
        },
      }),
      null
    );
  });

  it("Given the function receives a file without visibility, it should return an error", function () {
    expect(
      copyFile.bind(fileTransformation, {
        description: "this is my product",
        productName: "address finder",
        team: "integration",
        filters: {
          asset_type: "REST API",
          deprecated: true,
        },
      })
    ).to.throw("Visibility not found");
  });

  it("Given the function receives a valid file as an object with public visibility, it should run without an error", function () {
    assert.equal(
      copyFile({
        description: "this is my product",
        productName: "address finder",
        team: "integration",
        filters: {
          asset_type: "REST API",
          deprecated: true,
          visibility: "Public",
        },
      }),
      null
    );
  });
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
