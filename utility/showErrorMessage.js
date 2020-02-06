const colors = require("colors/safe");

const showErrorMessage = (text) => {
  console.log(colors.red(text.toUpperCase()));
  process.exit(0);
};

module.exports = showErrorMessage;
