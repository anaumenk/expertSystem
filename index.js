const constants = require("./constants");
const utility = require("./utility");
const fs = require("fs");

const {argv} = process;

if (argv.length !== 3) {
  utility.showErrorMessage(constants.USAGE);
}

const filename = argv[2];

if (fs.existsSync(filename)) {
  const file = fs.readFileSync(filename).toString().split("\n");
  const params = utility.validateParams(utility.createParams(file));
  const researchRules = utility.researchRules(params.rules);
} else {
  utility.showErrorMessage(`${constants.NO_FILE} ${filename}`);
}
