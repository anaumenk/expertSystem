const OPERATIONS = {
  NOT: function(x) { return !x; },
  AND: function(x, y) { return x && y; },
  OR:  function(x, y) { return x || y; },
  XOR: function(x, y) { return (x || y) && !(x && y); },
  IMPLIES: function(x, y) { return !x || y; },
  IIF: function(x, y) { return x === y; },
};

module.exports = OPERATIONS;
