const {
  NO_FACTS, NO_QUERIES, NO_RULES, UNSENT_INT, WRONG_RULE_STRUCTURE,
  QUERY_NO_FIND_IN_RULES, WRONG_CHARS, WRONG_CHARS_NUMBER, WRONG_CHARS_IN_FACTS, WRONG_CHARS_IN_QUERIES
} = require("../constants");
const { showErrorMessage } = require("./index");

const validateChars = (char) => /[A-Z]/.test(char);

const validateParenthesis = (rule) => {
  let holder = [];
  let openBrackets = ['('];
  let closedBrackets = [')'];
  for (let letter of rule){
    if (openBrackets.includes(letter)) {
      holder.push(letter)
    } else if(closedBrackets.includes(letter)) {
      let openPair = openBrackets[closedBrackets.indexOf(letter)];
      if (holder[holder.length - 1] === openPair) {
        holder.splice(-1,1);
      } else {
        holder.push(letter);
        break;
      }
    }
  }
  return (holder.length === 0);
};

const validateParams = ({facts, queries, rules}) => {
  if (facts.length === 0) {
    showErrorMessage(NO_FACTS);
  } else {
    facts = facts[0].slice(1).split("");
    facts.forEach((fact) => {
      if (!validateChars(fact)) {
        showErrorMessage(WRONG_CHARS_IN_FACTS);
      }
    })
  }

  if (queries.length === 0) {
    showErrorMessage(NO_QUERIES)
  } else {
    queries = queries[0].slice(1).split("");
    queries.forEach((query) => {
      if (!validateChars(query)) {
        showErrorMessage(WRONG_CHARS_IN_QUERIES);
      }
    })
  }

  if (rules.length === 0) {
    showErrorMessage(NO_RULES)
  } else {
    rules.forEach((rule) => {
      if (/^[A-Z()!\+\|\^\ ]+(=>|<=>)[A-Z()!\+\|\^\ ]+$/.test(rule) && validateParenthesis(rule)) {
        rule.split(/[\s<=>|\+\^]+/).forEach((char) => {
          if (char.length > 1 && !char.match(/[!()]+/)) {
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

module.exports.validateParams = validateParams;
module.exports.validateParenthesis = validateParenthesis;

