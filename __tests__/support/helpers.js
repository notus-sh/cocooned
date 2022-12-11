const setup = function (doc, context) {
  doc.body.innerHTML = context.template
  if (typeof context.prepare === 'function') context.prepare()

  return context.cocooned
}

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
  setup,
  asAttribute,
  asInt,
  clickEvent
}
