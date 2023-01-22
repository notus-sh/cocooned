import $ from 'jquery'
import { Builder } from './builder'
import { Emitter } from './emitter'
import { Selection } from './selection'

class Base {
  static defaultOptions () {
    return {}
  }

  static eventNamespaces () {
    return ['cocooned']
  }

  constructor (container, options) {
    this.container = $(container)
    this.options = this.normalizeConfig({
      ...this.constructor.defaultOptions(),
      ...('cocoonedOptions' in container.dataset ? JSON.parse(container.dataset.cocoonedOptions) : {}),
      ...(options || {})
    })

    this.init()
    this.container.get(0).dataset.cocooned = this
  }

  #emitter

  get emitter () {
    if (typeof this.#emitter === 'undefined') {
      this.#emitter = new Emitter(this.constructor.eventNamespaces())
    }

    return this.#emitter
  }

  notify (node, eventType, eventData) {
    if (node instanceof $) {
      return this.emitter.emit(node.get(0), eventType, eventData)
    }

    return this.emitter.emit(node, eventType, eventData)
  }

  #selection

  get selection () {
    if (typeof this.#selection === 'undefined') {
      this.#selection = new Selection(this.container.get(0))
    }

    return this.#selection
  }

  hide (node, callback) {
    return this.selection.hide(node, callback)
  }

  show (node, callback) {
    return this.selection.show(node, callback)
  }

  elementsCounter = 0

  // Compatibility with Cocoon
  // TODO: Remove in 3.0 (Only Cocoon namespaces).
  get namespaces () {
    return {
      events: ['cocooned', 'cocoon']
    }
  }

  // Compatibility with Cocoon
  // TODO: Remove in 3.0 (Only Cocoon class names).
  get classes () {
    return {
      // Actions link
      add: ['cocooned-add', 'add_fields'],
      remove: ['cocooned-remove', 'remove_fields'],
      up: ['cocooned-move-up'],
      down: ['cocooned-move-down'],
      // Containers
      container: ['cocooned-container'],
      item: ['cocooned-item', 'nested-fields']
    }
  }

  normalizeConfig (config) {
    return config
  }

  selectors (type, selector = '&') {
    return this.classes[type].map(klass => selector.replace(/&/, `.${klass}`))
  }

  selector (type, selector = '&') {
    return this.selectors(type, selector).join(', ')
  }

  buildId () {
    return `${new Date().getTime()}${this.elementsCounter++}`
  }

  getInsertionNode (adder) {
    const $adder = $(adder)
    const insertionNode = adder.dataset?.associationInsertionNode
    const insertionTraversal = adder.dataset?.associationInsertionTraversal

    if (typeof insertionNode === 'undefined') {
      return $adder.parent()
    }

    if (typeof insertionNode === 'function') {
      return insertionNode($adder)
    }

    if (typeof insertionTraversal !== 'undefined') {
      return $adder[insertionTraversal](insertionNode)
    }

    return insertionNode === 'this' ? $adder : $(insertionNode)
  }

  getInsertionMethod (adder) {
    return adder.dataset?.associationInsertionMethod || 'before'
  }

  getItems (selector) {
    return $(this.selector('item', selector), this.container).filter((_i, element) => {
      return ($(element).closest(this.selector('container')).get(0) === this.container.get(0))
    })
  }

  findContainer (addLink) {
    const insertionNode = this.getInsertionNode(addLink)
    const insertionMethod = this.getInsertionMethod(addLink)

    switch (insertionMethod) {
      case 'before':
      case 'after':
      case 'replaceWith':
        return insertionNode.parent()

      case 'append':
      case 'prepend':
      default:
        return insertionNode
    }
  }

  findItem (removeLink) {
    return $(removeLink).closest(this.selector('item'))
  }

  init () {
    this.addLinks = $(this.selector('add')).filter((_i, element) => {
      return (this.findContainer(element).get(0) === this.container.get(0))
    })

    this.initUi()
    this.bindEvents()
  }

  initUi () {
    if (!this.container.attr('id')) {
      this.container.attr('id', this.buildId())
    }
    this.container.addClass(this.classes.container.join(' '))

    $(() => this.hideMarkedForDestruction())
    $(document).on('page:load turbolinks:load turbo:load', () => this.hideMarkedForDestruction())
  }

  bindEvents () {
    const self = this

    // Bind add links
    this.addLinks.each((_i, link) => {
      link.addEventListener('click', function (e) {
        e.preventDefault()
        self.add(this, e)
      })
    })

    // Bind remove links
    // (Binded on document instead of container to not bypass click handler defined in jquery_ujs)
    document.addEventListener('click', function (e) {
      const { target } = e
      if (!self.selectors('remove').some(s => target.matches(s)) ||
          target.closest(self.selector('container')) !== self.container.get(0)) {
        return
      }

      e.preventDefault()
      self.remove(target, e)
    })
  }

  add (adder, originalEvent) {
    const $adder = $(adder)
    const insertionMethod = this.getInsertionMethod(adder)
    const insertionNode = this.getInsertionNode(adder)
    const count = parseInt(adder.dataset?.associationInsertionCount, 10) || parseInt(adder.dataset?.count, 10) || 1

    const builder = this.#builder(adder)

    for (let i = 0; i < count; i++) {
      const contentNode = $(builder.build(this.buildId()))
      const eventData = { link: $adder, node: contentNode, cocooned: this, originalEvent }
      const afterNode = (insertionMethod === 'replaceWith' ? contentNode : insertionNode)

      // Insertion can be prevented through a 'cocooned:before-insert' event handler
      if (!this.notify(insertionNode, 'before-insert', eventData)) {
        return false
      }

      insertionNode[insertionMethod](contentNode)

      this.notify(afterNode, 'after-insert', eventData)
    }
  }

  remove (remover, originalEvent) {
    const self = this
    const $remover = $(remover)
    const nodeToDelete = this.findItem($remover)
    const triggerNode = nodeToDelete.parent()
    const eventData = { link: $remover, node: nodeToDelete, cocooned: this, originalEvent }

    // Deletion can be prevented through a 'cocooned:before-remove' event handler
    if (!this.notify(triggerNode, 'before-remove', eventData)) {
      return false
    }

    const doRemove = function () {
      if ($remover.hasClass('dynamic')) {
        nodeToDelete.remove()
      } else {
        nodeToDelete.find('input[required], select[required]').each((_i, element) => $(element).removeAttr('required'))
        $remover.siblings('input[type=hidden][name$="[_destroy]"]').val('true')
        nodeToDelete.hide()
      }
      self.notify(triggerNode, 'after-remove', eventData)
    }
    const timeout = parseInt(triggerNode.get(0).dataset?.removeTimeout, 10) || 0

    if (timeout === 0) {
      doRemove()
    } else {
      setTimeout(doRemove, timeout)
    }
  }

  hideMarkedForDestruction () {
    $(this.selector('remove', '&.existing.destroyed'), this.container).each((i, link) => this.findItem(link).hide())
  }

  #builder (link) {
    const template = document.querySelector(`template[data-name=${link.dataset.template}]`)
    return new Builder(template.content, `new_${link.dataset.association}`)
  }
}

export {
  Base
}
