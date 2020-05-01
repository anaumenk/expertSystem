const constants = require("./constants");
const utility = require("./utility");
const fs = require("fs");

const {argv} = process;

if (argv.length !== 3) {
  utility.showErrorMessage(constants.USAGE);
}

const filename = argv[2];

if (!fs.existsSync(filename)) {
  utility.showErrorMessage(`${constants.NO_FILE} ${filename}`);
}

const fileStats = fs.lstatSync(filename);

if (!fileStats.isFile()) {
  utility.showErrorMessage(`${filename} ${constants.NOT_A_FILE}`);
}

const file = fs.readFileSync(filename).toString().split("\n");
const params = utility.validateParams.validateParams(utility.createParams(file));
const solution = utility.findSolution(params);
utility.printResults(params.queries, solution);
