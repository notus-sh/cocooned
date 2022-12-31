import $ from 'jquery'
import Builder from './cocooned/builder'

class Cocooned {
  static defaultOptions () {
    return {}
  }

  constructor (container, options) {
    this.container = $(container)
    this.options = this.normalizeConfig(Object.assign(
      {},
      this.constructor.defaultOptions(),
      (this.container.data('cocooned-options') || {}),
      (options || {})
    ))

    this.init()
    this.container.get(0).dataset.cocooned = this
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

  notify (node, eventType, eventData) {
    return !(this.namespaces.events.some(function (namespace) {
      const namespacedEventType = [namespace, eventType].join(':')
      const event = $.Event(namespacedEventType, eventData)
      const eventArgs = [eventData.cocooned]

      if (Object.prototype.hasOwnProperty.call(eventData, 'node')) {
        eventArgs.unshift(eventData.node)
      } else if (Object.prototype.hasOwnProperty.call(eventData, 'nodes')) {
        eventArgs.unshift(eventData.nodes)
      }

      node.trigger(event, eventArgs)
      return (event.isPropagationStopped() || event.isDefaultPrevented())
    }))
  }

  selector (type, selector) {
    const s = selector || '&'
    return this.classes[type].map(function (klass) { return s.replace(/&/, '.' + klass) }).join(', ')
  }

  namespacedNativeEvents (type) {
    const namespaces = this.namespaces.events.map(function (ns) { return '.' + ns })
    namespaces.unshift(type)
    return namespaces.join('')
  }

  buildId () {
    return (new Date().getTime() + this.elementsCounter++)
  }

  getInsertionNode (adder) {
    const $adder = $(adder)
    const insertionNode = $adder.data('association-insertion-node')
    const insertionTraversal = $adder.data('association-insertion-traversal')

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
    const $adder = $(adder)
    return $adder.data('association-insertion-method') || 'before'
  }

  getItems (selector) {
    selector = selector || ''
    const self = this
    return $(this.selector('item', selector), this.container).filter(function () {
      return ($(this).closest(self.selector('container')).get(0) === self.container.get(0))
    })
  }

  findContainer (addLink) {
    const $adder = $(addLink)
    const insertionNode = this.getInsertionNode($adder)
    const insertionMethod = this.getInsertionMethod($adder)

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
    const self = this
    this.addLinks = $(this.selector('add')).filter(function () {
      const container = self.findContainer(this)
      return (container.get(0) === self.container.get(0))
    })

    this.initUi()
    this.bindEvents()
  }

  initUi () {
    const self = this

    if (!this.container.attr('id')) {
      this.container.attr('id', this.buildId())
    }
    this.container.addClass(this.classes.container.join(' '))

    $(function () { self.hideMarkedForDestruction() })
    $(document).on('page:load turbolinks:load turbo:load', function () { self.hideMarkedForDestruction() })
  }

  bindEvents () {
    const self = this

    // Bind add links
    this.addLinks.on(
      this.namespacedNativeEvents('click'),
      function (e) {
        e.preventDefault()
        e.stopPropagation()

        self.add(this, e)
      })

    // Bind remove links
    // (Binded on document instead of container to not bypass click handler defined in jquery_ujs)
    $(document).on(
      this.namespacedNativeEvents('click'),
      this.selector('remove', '#' + this.container.attr('id') + ' &'),
      function (e) {
        e.preventDefault()
        e.stopPropagation()

        self.remove(this, e)
      })

    // Bind options events
    $.each(this.options, function (name, value) {
      const bindMethod = 'bind' + name.charAt(0).toUpperCase() + name.slice(1)
      if (value && self[bindMethod]) {
        self[bindMethod]()
      }
    })
  }

  add (adder, originalEvent) {
    const $adder = $(adder)
    const insertionMethod = this.getInsertionMethod($adder)
    const insertionNode = this.getInsertionNode($adder)
    const count = parseInt($adder.data('association-insertion-count'), 10) || parseInt($adder.data('count'), 10) || 1

    const builder = this.#builder($adder)

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
        nodeToDelete.find('input[required], select[required]').each(function (index, element) {
          $(element).removeAttr('required')
        })
        $remover.siblings('input[type=hidden][name$="[_destroy]"]').val('true')
        nodeToDelete.hide()
      }
      self.notify(triggerNode, 'after-remove', eventData)
    }
    const timeout = parseInt(triggerNode.data('remove-timeout'), 10) || 0

    if (timeout === 0) {
      doRemove()
    } else {
      setTimeout(doRemove, timeout)
    }
  }

  hideMarkedForDestruction () {
    const self = this
    $(this.selector('remove', '&.existing.destroyed'), this.container).each(function (i, removeLink) {
      const node = self.findItem(removeLink)
      node.hide()
    })
  }

  #builder (link) {
    const template = document.getElementById(link.data('template-id'));
    return new Builder(template.content, `new_${link.data('association')}`)
  }
}

export {
  Cocooned
}
