const colors = require("colors/safe");

const printResults = (queries, solution) => {
    queries.forEach((query) => {
        const answer = solution[query] || "undetermined";
        console.log(`${query} = ${answer 
            ? colors.green(answer) 
            : !answer 
                ? colors.red(answer)
                : colors.yellow(answer)
        }`);
    })
};

module.exports = printResults;
