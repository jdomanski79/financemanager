exports.checked = function (value, test) {
  if (value == test) {
    return 'checked'
  } else {
    return ''
  }
}
exports.selected = function(value, test) {
  if ( String(value) == String(test) ) {
      return 'selected'
    } else {
      return ''
    }
}