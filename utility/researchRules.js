const {TYPES} = require("../constants");

const breakRule = (rule) => {
  const match = rule.match(`${TYPES.IMPLIES}|${TYPES.IIF}|\\${TYPES.AND}|\\${TYPES.OR}|\\${TYPES.NOT}|\\${TYPES.XOR}`);
  let type,left,right = undefined;
  if (match) {
    type = Object.keys(TYPES).find(key => TYPES[key] === match[0]);
    rule = rule.split(TYPES[type]);
    left = breakRule(rule[0]);
    right = breakRule(rule[1]);
  } else {
    type = TYPES.SINGLE;
    left = rule;
  }
  return {
    type,
    left,
    right,
  }
};

const researchRules = (rules) => {
  rules = rules.map((rule) => breakRule(rule));
  return rules;
};

module.exports = researchRules;
