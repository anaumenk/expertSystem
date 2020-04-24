const {OPERAND, OPERATIONS, UNSENT_INT, WRONG_RULE_STRUCTURE} = require("../constants");
const {validation, showErrorMessage} = require("./index");

const resolveRules = (rules, variant) => {
  rules = rules.map((rule) => {
    rule = setBool(JSON.parse(JSON.stringify(rule)), variant);
    return (function __resolveRules(rule) {
      if (rule.type !== OPERAND.SINGLE) {
        if (OPERAND[rule.type] === OPERAND.NOT) {
          rule.left = !rule.left.left;
          rule.type = OPERAND.SINGLE;
          rule.right = undefined;
        } else if (rule.left.type === OPERAND.SINGLE && rule.right.type === OPERAND.SINGLE) {
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
  return rules.findIndex((rule) => !rule);
};

const setBool = (rule, variant) => {
  if (rule) {
    if (rule.type === OPERAND.SINGLE) {
      rule.left = variant.find((fact) => fact.fact === rule.left).value;
    } else {
      rule.right = setBool(rule.right, variant);
      rule.left = setBool(rule.left, variant);
    }
  }
  return rule;
};

const findFactToChange = (equation, facts) => {
  let factToChange = [];
  (function __findFactToChange(equation) {
    if (equation) {
      if (equation.type === OPERAND.SINGLE && !facts[facts.findIndex((fact) => fact.fact === equation.left)].value) {
        factToChange.push(equation.left);
      } else {
        equation.left = __findFactToChange(equation.left);
        equation.right = __findFactToChange(equation.right);
      }
    }
    return equation;
  }(equation));
  return factToChange.length > 0 ? factToChange[factToChange.length - 1] : null;
};

const considerOptions = (rules, facts) => {
  let res = resolveRules(rules, facts);
  while (res !== UNSENT_INT) {
    const factToChange = findFactToChange(rules[res].right, facts) || findFactToChange(rules[res].left, facts);
    facts = facts.map((fact) => {
      if (fact.fact === factToChange && fact.changeable) {
        fact.value = !fact.value;
      }
      return fact
    });
    res = resolveRules(rules, facts);
  }
  return facts;
};

const closeBracketIndex = (rule) => {
  let brackets = 0;
  for (let i = 0; i < rule.length; i++) {
    if (rule[i] === '(') {
      brackets++;
    }
    if (rule[i] === ')') {
      brackets--;
    }
    if (brackets === 0) {
      return i + 1;
    }
  }
  return UNSENT_INT;
};

const breakRule = (rule, letters, facts) => {
  let match = rule.match(`${OPERAND.IMPLIES}|${OPERAND.IIF}`)
      || rule.match(`\\${OPERAND.AND}|\\${OPERAND.OR}|\\${OPERAND.XOR}|[()]`)
      || rule.match(`\\${OPERAND.NOT}`);
  let type,left,right = undefined;

  if (match && match[0] === '(') {
    if (!validation.validateParenthesis(rule)) {
      showErrorMessage(WRONG_RULE_STRUCTURE)
    }
    const innerRule = rule.slice(0, closeBracketIndex(rule));
    rule = innerRule.length === rule.length ? innerRule.slice(1, -1) : rule.replace(innerRule, "");
    match = rule.match(`\\${OPERAND.AND}|\\${OPERAND.OR}|\\${OPERAND.XOR}`) || rule.match(`\\${OPERAND.NOT}`);
    if (match) {
      type = Object.keys(OPERAND).find(key => OPERAND[key] === match[0]);
      rule = rule.replace(OPERAND[type], '\x01').split('\x01');
      left = breakRule(innerRule.slice(1, -1), letters, facts);
      right = breakRule(rule[1], letters, facts);
    } else {
      type = OPERAND.SINGLE;
      left = rule;
    }
  } else if (match) {
    type = Object.keys(OPERAND).find(key => OPERAND[key] === match[0]);
    if (match[0] === OPERAND.NOT) {
      rule = rule.replace(OPERAND[type], '\x01');
      left = breakRule(rule[1], letters, facts);
    } else {
      rule = rule.replace(OPERAND[type], '\x01').split('\x01');
      left = breakRule(rule[0], letters, facts);
      right = breakRule(rule[1], letters, facts);
    }
  } else {
    type = OPERAND.SINGLE;
    left = rule;
  }
  if (rule.length === 1 && (letters.length === 0 || !letters.find((item) => item.fact === rule))) {
    const isTrue = !!facts.find((fact) => fact === rule);
    letters.push({
      fact: rule,
      value: isTrue,
      changeable: !isTrue
    });
  }
  return {
    type,
    left,
    right,
  }
};

const findSolution = (params) => {
  const AtomNode = [];
  params.rules = params.rules.map((rule) => breakRule(rule, AtomNode, params.facts));
  return considerOptions(params.rules, AtomNode);
};

module.exports = findSolution;
