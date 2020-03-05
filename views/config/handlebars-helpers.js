module.exports = {
  ifeq: function(a, b, options){
    if (a === b) {
      return options.fn(this);
      }
    return options.inverse(this);
  },
  ifequals: function(a, b, c, d, options){
    if (a === b && c === d) {
      return options.fn(this);
      }
    return options.inverse(this);
  },
  ifnoteq: function(a, b, options){
    if (a != b ) {
      return options.fn(this);
      }
    return options.inverse(this);
  },
  pagemod: function(a, b, options){
    let result;
    if ( b == "+" ) {
      result = +a + 1;
      return result;
      } else if ( b == "-") {
        result = +a -1
        return result;
      }
  }
}