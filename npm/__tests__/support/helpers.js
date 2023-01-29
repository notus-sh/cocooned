const setup = function (doc, context) {
  doc.body.innerHTML = context.template
  if (typeof context.prepare === 'function') context.prepare()

  const cocooned = context.cocooned
  cocooned.start()
}

const asInt = function (value) {
  return parseInt(value, 10)
}

const clickEvent = function () {
  return new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
}

export {
  setup,
  asInt,
  clickEvent
}
