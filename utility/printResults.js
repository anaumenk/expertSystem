const colors = require("colors/safe");

const printResults = (queries, solution) => {
    queries.forEach((query) => {
        const answer = solution[query];
        console.log(`${query} = ${answer 
            ? colors.green(answer) 
            : answer === undefined
                ? colors.yellow("undetermined")
                : colors.red(answer)
        }`);
    })
};

module.exports = printResults;
