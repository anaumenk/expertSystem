const colors = require("colors/safe");

const printResults = (queries, solution) => {
    queries.forEach((query) => {
        const answer = solution.find((fact) => fact.fact === query).value;
        console.log(`${query} = ${answer 
            ? colors.green(answer) 
            : answer === undefined
                ? colors.yellow("undetermined")
                : colors.red(answer)
        }`);
    })
};

module.exports = printResults;
