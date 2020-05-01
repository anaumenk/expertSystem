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

module.exports = validateParenthesis;