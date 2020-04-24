const constants = require("./constants");
const utility = require("./utility");
const fs = require("fs");

const {argv} = process;

if (argv.length !== 3) {
  utility.showErrorMessage(constants.USAGE);
}

const filename = argv[2];
const fileStats = fs.lstatSync(filename);

if (!fileStats.isFile()) {
  utility.showErrorMessage(`${filename} ${constants.NOT_A_FILE}`);
}

if (fs.existsSync(filename)) {
  const file = fs.readFileSync(filename).toString().split("\n");
  const params = utility.validation.validateParams(utility.createParams(file));
  const solution = utility.findSolution(params);
  utility.printResults(params.queries, solution);
} else {
  utility.showErrorMessage(`${constants.NO_FILE} ${filename}`);
}
