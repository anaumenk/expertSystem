const {
  NO_FACTS, NO_QUERIES, NO_RULES, UNSENT_INT, WRONG_RULE_STRUCTURE,
  QUERY_NO_FIND_IN_RULES, WRONG_CHARS, WRONG_CHARS_NUMBER,
} = require("../constants");
const { showErrorMessage } = require("./index");

const validateChars = (char) => /[A-Z]/.test(char);

const validateParams = ({facts, queries, rules}) => {
  if (facts.length === 0) {
    showErrorMessage(NO_FACTS);
  } else {
    facts = facts[0].slice(1).split("");
    facts.forEach((fact) => {
      if (!validateChars(fact)) {
        showErrorMessage(WRONG_CHARS);
      }
    })
  }

  if (queries.length === 0) {
    showErrorMessage(NO_QUERIES)
  } else {
    queries = queries[0].slice(1).split("");
    queries.forEach((query) => {
      if (!validateChars(query)) {
        showErrorMessage(WRONG_CHARS);
      }
    })
  }

  if (rules.length === 0) {
    showErrorMessage(NO_RULES)
  } else {
    rules.forEach((rule) => {
      if (/^[A-Z()!\+\|\^\ ]+(=>|<=>)[A-Z()!\+\|\^\ ]+$/.test(rule)) {
        rule.split(/[\s<=>|\+\^]+/).forEach((char) => {
          if (char.length > 1 && char.indexOf("!") === UNSENT_INT) {
            showErrorMessage(WRONG_CHARS_NUMBER);
          } else if (!validateChars(char)) {
            showErrorMessage(WRONG_CHARS);
          }
        });
      } else {
        showErrorMessage(WRONG_RULE_STRUCTURE);
      }
    });
  }

  queries.forEach((query) => {
    let find = false;
    rules.forEach((rule) => {
      if(rule.indexOf(query) !== UNSENT_INT) {
        find = true;
      }
    });
    if (!find) {
      showErrorMessage(`${query} ${QUERY_NO_FIND_IN_RULES}`);
    }
  });

  return {
    facts,
    queries,
    rules
  }
};

module.exports = validateParams;
