function clickHandler(callback) {
  return e => {
    e.preventDefault()
    callback(e)
  }
}

function delegatedClickHandler(selector, callback) {
  return e => {
    const { target } = e
    if (!target.matches(selector)) {
      return
    }

    e.preventDefault()
    callback(e)
  }
}

export {
  clickHandler,
  delegatedClickHandler
}
