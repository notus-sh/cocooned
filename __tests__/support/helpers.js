const asAttribute = function (string) {
  return string.replaceAll(/</g, '&lt;')
    .replaceAll(/>/g, '&gt;')
    .replaceAll(/"/g, '&quot;')
    .trim()
}

const clickEvent = function () {
  return new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
}

module.exports = {
  asAttribute,
  clickEvent
}
