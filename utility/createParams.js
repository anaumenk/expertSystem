const { ONE_FACT, ONE_QUERY } = require("../constants");
const {showErrorMessage} = require("./index");

const createParams = (file) => {
  let facts = [];
  let queries = [];
  let rules = [];

  file.forEach((line) => {
    line = line.replace(/\s|{##}.+($|\n)/g, "");

    if (line[0]) {
      if (line[0] === "=") {
        if (facts.length === 0) {
          facts.push(line);
        } else {
          showErrorMessage(ONE_QUERY)
        }
      } else if (line[0] === "?") {
        if (queries.length === 0) {
          queries.push(line);
        } else {
          showErrorMessage(ONE_FACT)
        }
      } else {
        rules.push(line)
      }
    }
  });
  return {
    facts,
    queries,
    rules
  }
};

module.exports = createParams;
