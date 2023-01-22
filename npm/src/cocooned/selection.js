const scopedStyles = `
  .cocooned-item { overflow: hidden; transition: opacity .45s ease-out, max-height .45s ease-out .45; }
  .cocooned-item--visible { opacity: 1; max-height: 100%; }
  .cocooned-item--hidden { opacity: 0; max-height: 0%; }
`

function createScopedStyles(container, styles) {
  const element = container.ownerDocument.createElement('style')
  element.setAttribute('scoped', 'scoped')
  element.setAttribute('type', 'text/css')
  element.innerHTML = styles

  return element
}

class Selection {
  static scopedStyles = scopedStyles
  static get selectors () {
    return {
      'container': ['.cocooned-container'],
      'item': ['.cocooned-item', '.nested-fields'],
      'triggers.add': ['.cocooned-add', '.add_fields'],
      'triggers.remove': ['.cocooned-remove', '.remove_fields'],
      'triggers.up': ['.cocooned-move-up'],
      'triggers.down': ['.cocooned-move-down']
    }
  }

  _container
  _options = { transitions: !('test' === process?.env?.NODE_ENV) }

  constructor (container, options = {}) {
    this._container = container
    this._options = { ...this._options, ...options }

    this._container.prepend(createScopedStyles(this._container, this.constructor.scopedStyles))
  }

  get items () {
    return Array.from(this._container.querySelectorAll(this.selector('item')))
                .filter(element =>  element.closest(this.selector('container')) === this._container)
  }

  toItem (node) {
    return node.closest(this.selector('item'))
  }

  contains (node) {
    return this.items.includes(this.toItem(node))
  }

  matches (node, selectorName) {
    return this.selectors(selectorName).some(s => node.matches(s)) && this.contains(node)
  }

  selectors (name) {
    return this.constructor.selectors[name]
  }

  selector (name) {
    return this.selectors(name).join(', ')
  }

  hide(item, callback) {
    this._toggle(item, 'cocooned-item--visible', 'cocooned-item--hidden', callback)
  }

  show(item, callback) {
    this._toggle(item, 'cocooned-item--hidden', 'cocooned-item--visible', callback)
  }

  _toggle (item, removedClass, addedClass, callback) {
    if (typeof callback === 'function' && this._options.transitions) {
      item.addEventListener('transitionend', callback, { once: true })
    }

    if (item.classList.contains(removedClass)) {
      item.classList.replace(removedClass, addedClass)
    } else {
      item.classList.add(addedClass)
    }

    if (typeof callback === 'function' && !this._options.transitions) {
      callback()
    }
  }
}

export default Selection
