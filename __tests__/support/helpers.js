const asAttribute = function (string) {
  return string.replaceAll(/</g, '&lt;')
    .replaceAll(/>/g, '&gt;')
    .replaceAll(/"/g, '&quot;')
    .trim()
}

const asInt = function (value) {
  return parseInt(value, 10)
}

const clickEvent = function () {
  return new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
}

module.exports = {
  asAttribute,
  asInt,
  clickEvent
}
