module.exports = {
  // check is a value of a variable equals to a value
  ifeq: function(a, b, options){
    if (a === b) {
      return options.fn(this);
      }
    return options.inverse(this);
  },
  // check the value of 2 variables
  ifequals: function(a, b, c, d, options){
    if (a === b && c === d) {
      return options.fn(this);
      }
    return options.inverse(this);
  },
  // check is a value of a variable not equals to a value
  ifnoteq: function(a, b, options){
    if (a !== b) {
      return options.fn(this);
      }
    return options.inverse(this);
  },
  // create pagination page numbers
  iterateNTimes: function(n, block) {
    let accum = '';
    for(let i = 0; i < n; ++i)
        accum += block.fn(i + 1);
    return accum;
}
}