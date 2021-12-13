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
  it("Given the function receives a file name as a string it should return a string", function () {
    assert.equal(typeof readFile("assert1.yaml"), "string");
  });

  it("Given the function receives a file name as a string it should return its data as a string", function () {
    assert.equal(
      readFile("assert1.yaml"),
      'description: "this is my product" team: integration productName: address finder filters: #filter options asset_type: "REST API" deprecated: true visibility: "Internal"'
    );
  });
});
