const clickEvent = function () {
  return new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
}

const getItems = function (container) {
  return container.querySelectorAll('[data-cocooned-item]')
}

const getItem = function (container, item = 0) {
  return getItems(container).item(item)
}

const getAddLinks = function (container) {
  return container.querySelectorAll('[data-cocooned-trigger="add"]')
}

const getAddLink = function (container, item = 0) {
  return getAddLinks(container).item(item)
}

const getRemoveLinks = function (container) {
  return container.querySelectorAll('[data-cocooned-trigger="remove"]')
}

const getRemoveLink = function (container, item = 0) {
  return getRemoveLinks(container).item(item)
}

const getMoveUpLinks = function (container) {
  return container.querySelectorAll('[data-cocooned-trigger="up"]')
}

const getMoveUpLink = function (container, item = 0) {
  return getMoveUpLinks(container).item(item)
}

const getMoveDownLinks = function (container) {
  return container.querySelectorAll('[data-cocooned-trigger="down"]')
}

const getMoveDownLink = function (container, item = 0) {
  return getMoveDownLinks(container).item(item)
}

export {
  clickEvent,
  getItems,
  getItem,
  getAddLinks,
  getAddLink,
  getRemoveLinks,
  getRemoveLink,
  getMoveUpLinks,
  getMoveUpLink,
  getMoveDownLinks,
  getMoveDownLink
}
