import $ from 'jquery'

const reorderableMixin = (Base) => class extends Base {
  static defaultOptions () {
    return { ...super.defaultOptions(), ...{ reorderable: false } }
  }

  normalizeConfig (config) {
    const normalized = super.normalizeConfig(config)
    if (typeof normalized.reorderable === 'boolean' && normalized.reorderable) {
      normalized.reorderable = { startAt: 1 }
    }

    return normalized
  }

  bindEvents () {
    super.bindEvents()
    if (this.options.reorderable === false) {
      return
    }

    const self = this

    // Maintain indexes
    this.container
      .on('cocooned:after-insert', function (e) { self.reindex(e) })
      .on('cocooned:after-remove', function (e) { self.reindex(e) })
      .on('cocooned:after-move', function (e) { self.reindex(e) })

    // Move items
    this.container.on(
      this.namespacedNativeEvents('click'),
      [this.selector('up'), this.selector('down')].join(', '),
      function (e) {
        e.preventDefault()
        e.stopPropagation()

        const node = this
        const up = self.classes.up.some(function (klass) {
          return node.className.indexOf(klass) !== -1
        })
        self.move(this, up ? 'up' : 'down', e)
      })

    // Ensure positions are unique before save
    this.container.closest('form').on(
      this.namespacedNativeEvents('submit'),
      function (e) {
        self.reindex(e)
      })
  }

  move (moveLink, direction, originalEvent) {
    const self = this
    const $mover = $(moveLink)
    const node = $mover.closest(this.selector('item'))
    const siblings = (direction === 'up'
      ? node.prevAll(this.selector('item', '&:eq(0)'))
      : node.nextAll(this.selector('item', '&:eq(0)')))

    if (siblings.length === 0) {
      return
    }

    // Move can be prevented through a 'cocooned:before-move' event handler
    const eventData = { link: $mover, node, cocooned: self, originalEvent }
    if (!self.notify(node, 'before-move', eventData)) {
      return false
    }

    const height = self.container.outerHeight()
    const width = self.container.outerWidth()

    self.container.css('height', height).css('width', width)
    self.hide(node, function () {
      const movedNode = $(this).detach()
      movedNode[(direction === 'up' ? 'insertBefore' : 'insertAfter')](siblings)

      self.show(movedNode, function () {
        self.container.css('height', '').css('width', '') // Object notation does not work here.
        self.notify(movedNode, 'after-move', eventData)
      })
    })
  }

  reindex (originalEvent) {
    let i = this.options.reorderable.startAt
    const nodes = this.getItems().filter(function () {
      return $(this).css('display') !== 'none'
    })
    const eventData = { link: null, nodes, cocooned: this, originalEvent }

    // Reindex can be prevented through a 'cocooned:before-reindex' event handler
    if (!this.notify(this.container, 'before-reindex', eventData)) {
      return false
    }

    nodes.each(function () { $('input[name$="[position]"]', this).val(i++) })
    this.notify(this.container, 'after-reindex', eventData)
  }

  show (node, callback) {
    callback = callback || function () { return true }

    node.addClass('cocooned-visible-item')
    setTimeout(function () {
      callback.apply(node)
      node.removeClass('cocooned-hidden-item')
    }, 500)
  }

  hide (node, callback) {
    node.removeClass('cocooned-visible-item').addClass('cocooned-hidden-item')
    if (callback) {
      setTimeout(function () {
        callback.apply(node)
      }, 500)
    }
  }
}

export default reorderableMixin
