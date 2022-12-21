const getItems = function (container) {
  return container.querySelectorAll('.cocooned-item')
}

const getItem = function (container, item = 0) {
  return getItems(container).item(item)
}

const getAddLinks = function (container) {
  return container.querySelectorAll('.cocooned-add')
}

const getAddLink = function (container, item = 0) {
  return getAddLinks(container).item(item)
}

const getRemoveLinks = function (container, selector = '') {
  return container.querySelectorAll(`.cocooned-remove${selector}`)
}

const getRemoveLink = function (container, selector = '', item = 0) {
  return getRemoveLinks(container, selector).item(item)
}

const getMoveUpLinks = function (container) {
  return container.querySelectorAll('.cocooned-move-up')
}

const getMoveUpLink = function (container, item = 0) {
  return getMoveUpLinks(container).item(item)
}

const getMoveDownLinks = function (container) {
  return container.querySelectorAll('.cocooned-move-down')
}

const getMoveDownLink = function (container, item = 0) {
  return getMoveDownLinks(container).item(item)
}

export {
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
