function clickHandler (callback) {
  return e => {
    e.preventDefault()
    callback(e)
  }
}

function delegatedClickHandler (selector, callback) {
  const handler = clickHandler(callback)

  return e => {
    const { target } = e
    if (target.closest(selector) === null) {
      return
    }

    handler(e)
  }
}

function itemDelegatedClickHandler (container, selector, callback) {
  const delegatedHandler = delegatedClickHandler(selector, callback)

  return e => {
    if (!container.contains(e.target)) {
      return
    }

    delegatedHandler(e)
  }
}

export {
  clickHandler,
  delegatedClickHandler,
  itemDelegatedClickHandler
}
