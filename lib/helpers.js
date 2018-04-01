exports.checked = function (value, test) {
  if (value == test) {
    return 'checked'
  } else {
    return ''
  }
}
exports.selected = function(value, test) {
  console.log( "helper selected value: "+ value + "test: " + test);
  if (value == test) {
      return 'selected'
    } else {
      return ''
    }
}