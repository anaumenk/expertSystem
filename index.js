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

  const researchRules = utility.researchRules(params.rules, params.facts);
  //   пройтись по researchRules all bool variants
  // учитывая операторы
  // var operations = {
  //   not: function(x) { return !x; },
  //   and: function(x, y) { return x && y; },
  //   or:  function(x, y) { return x || y; },
  //   xor: function(x, y) { return (x || y) && !(x && y); },
  //   imply: function(x, y) { return !x || y; },
  //   iff: function(x, y) { return x === y; },
  //   single: function(x) { return x;}
  // };
} else {
  utility.showErrorMessage(`${constants.NO_FILE} ${filename}`);
}
