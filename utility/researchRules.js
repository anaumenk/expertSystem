const {TYPES} = require("../constants");

const boolIt = (letters) => {
  var res = [];
  for (let i = 0; i < (1 << letters.length); i++) {
    const boolArr = {};
    for (let j = 0; j < letters.length; j++) {
      boolArr[letters[j]] = Boolean(i & (1 << j));
    }
    res.push(boolArr)
  }
  return res;
};

const breakRule = (rule, letters) => {
  const match = rule.match(`${TYPES.IMPLIES}|${TYPES.IIF}|\\${TYPES.AND}|\\${TYPES.OR}|\\${TYPES.NOT}|\\${TYPES.XOR}`);
  let type,left,right = undefined;
  if (match) {
    type = Object.keys(TYPES).find(key => TYPES[key] === match[0]);
    rule = rule.split(TYPES[type]);
    left = breakRule(rule[0], letters);
    right = breakRule(rule[1], letters);
  } else {
    type = TYPES.SINGLE;
    left = rule;

    if (letters.length === 0 || !letters.find((item) => item === rule)) {
      letters.push(rule);
    }

  }
  return {
    type,
    left,
    right,
  }
};

const researchRules = (rules, facts) => {
  const letters = [];
  rules = rules.map((rule) => breakRule(rule, letters));
  const bool = boolIt(letters).filter((item) => facts.every((fact) => item[fact] || item[fact] === undefined));
  return rules;
};

module.exports = researchRules;
