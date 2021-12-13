const assert = require("assert");
const { expect } = require("chai");
const rewire = require("rewire");
const fileTransformation = rewire("../fileTransformation");

describe("getFileNames", function () {
  it("Given the function receives a directory name as a string it should return an array", function () {
    assert.equal(
      Array.isArray(
        fileTransformation.getFileNames(
          "./activity-exchange-file-processing/input-files"
        )
      ),
      true
    );
  });

  it("Given the function receives a directory name as a string it should return all of the files in the directory as an array", function () {
    const result = fileTransformation.getFileNames(
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
    expect(
      fileTransformation.getFileNames.bind(fileTransformation, "notADirectory")
    ).to.throw("ENOENT: no such file or directory, scandir 'notADirectory'");
  });

  it("Given the function receives a directory that contains no files, it should return an error", function () {
    expect(
      fileTransformation.getFileNames.bind(
        fileTransformation,
        "./activity-exchange-file-processing/input-files-test"
      )
    ).to.throw("The directory is empty");
  });
});