const {OPERAND, OPERATIONS} = require("../constants");

const isOneResult = (possible, last, rules) => {
  if (possible.length > 0) {
    let result = checkByRules(possible, rules);
    if (!result || result.length !== 1) {
      result = [isOneResult(last, [], rules)]
    }
    return result[0];
  } else {
    return {}
  }
};

const resolveRules = (rules, variant) => {
  return rules.every((rule) => {
    rule = setBool(JSON.parse(JSON.stringify(rule)), variant);
    return (function __resolveRules(rule) {
      if (rule.type !== OPERAND.SINGLE) {
        if (rule.left.type === OPERAND.SINGLE && rule.right.type === OPERAND.SINGLE) {
          rule.left = OPERATIONS[rule.type](rule.left.left, rule.right.left);
          rule.type = OPERAND.SINGLE;
          rule.right = undefined;
        } else {
          rule.left = __resolveRules(rule.left);
          rule.right = __resolveRules(rule.right);
          rule = __resolveRules(rule);
        }
      }
      return rule;
    })(rule).left;
  });
};

const setBool = (rule, variant) => {
  if (rule) {
    if (rule.type === OPERAND.SINGLE) {
      rule.left = variant[rule.left];
    } else {
      rule.right = setBool(rule.right, variant);
      rule.left = setBool(rule.left, variant);
    }
  }
  return rule;
};

const checkByRules = (variants, rules) => {
  const possibleResult = [];
  variants.forEach((variant) => {
    if (resolveRules(rules, variant)) {
      possibleResult.push(variant);
    }
  });
  return possibleResult;
};

const defaultFalse = (bool, facts, queries) => {
  const res = [];
  bool.forEach((variant) => {
    Object.keys(variant).forEach((atom) => {
      if (!facts.find((fact) => fact === atom)
          && !queries.find((query) => query === atom) && !variant[atom]) {
        res.push(variant)
      }
    })
  });
  return res;
};

const GenerateBool = (AtomNode) => {
  const res = [];
  for (let i = 0; i < (1 << AtomNode.length); i++) {
    const boolArr = {};
    for (let j = 0; j < AtomNode.length; j++) {
      boolArr[AtomNode[j]] = Boolean(i & (1 << j));
    }
    res.push(boolArr)
  }
  return res;
};

const breakRule = (rule, letters) => {
  const match = rule
      .match(`${OPERAND.IMPLIES}|${OPERAND.IIF}|\\${OPERAND.AND}|\\${OPERAND.OR}|\\${OPERAND.NOT}|\\${OPERAND.XOR}`);
  let type,left,right = undefined;
  if (match) {
    type = Object.keys(OPERAND).find(key => OPERAND[key] === match[0]);
    rule = rule.replace(OPERAND[type], '\x01').split('\x01');
    left = breakRule(rule[0], letters);
    right = breakRule(rule[1], letters);
  } else {
    type = OPERAND.SINGLE;
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

const findSolution = (params) => {
  const AtomNode = [];
  params.rules = params.rules.map((rule) => breakRule(rule, AtomNode));
  let bool = GenerateBool(AtomNode)
      .filter((item) => params.facts.every((fact) => item[fact] || item[fact] === undefined));
  const possible = defaultFalse(bool, params.facts, params.queries);

  return isOneResult(possible,
      bool.filter((value) => value !== possible.find((obj) => obj === value)), params.rules);
};

module.exports = findSolution;
