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

    // Maintain indexes
    this.container
      .on('cocooned:after-insert', e => this.reindex(e))
      .on('cocooned:after-remove', e => this.reindex(e))
      .on('cocooned:after-move', e => this.reindex(e))
    
    // Ensure positions are unique before save
    this.container.closest('form').on(this.namespacedNativeEvents('submit'), e => this.reindex(e))

    // Move items
    const self = this
    this.container.on(
      this.namespacedNativeEvents('click'),
      [this.selector('up'), this.selector('down')].join(', '),
      function (e) {
        e.preventDefault()
        e.stopPropagation()

        const node = this
        const up = self.classes.up.some(c => node.className.indexOf(c) !== -1)
        self.move(this, up ? 'up' : 'down', e)
      })
  }

  move (moveLink, direction, originalEvent) {
    const $mover = $(moveLink)
    const node = $mover.closest(this.selector('item'))
    const siblings = (direction === 'up'
      ? node.prevAll(this.selector('item', '&:eq(0)'))
      : node.nextAll(this.selector('item', '&:eq(0)')))

    if (siblings.length === 0) {
      return
    }

    // Move can be prevented through a 'cocooned:before-move' event handler
    const eventData = { link: $mover, node, cocooned: this, originalEvent }
    if (!this.notify(node, 'before-move', eventData)) {
      return false
    }

    const height = this.container.outerHeight()
    const width = this.container.outerWidth()

    this.container.css('height', height).css('width', width)
    this.hide(node, () => {
      const movedNode = $(node).detach()
      movedNode[(direction === 'up' ? 'insertBefore' : 'insertAfter')](siblings)

      this.show(movedNode, () => {
        this.container.css('height', '').css('width', '') // Object notation does not work here.
        this.notify(movedNode, 'after-move', eventData)
      })
    })
  }

  reindex (originalEvent) {
    const nodes = this.getItems().filter((_i, element) => $(element).css('display') !== 'none')
    const eventData = { link: null, nodes, cocooned: this, originalEvent }

    // Reindex can be prevented through a 'cocooned:before-reindex' event handler
    if (!this.notify(this.container, 'before-reindex', eventData)) {
      return false
    }

    let i = this.options.reorderable.startAt
    nodes.each((_i, element) => $('input[name$="[position]"]', element).val(i++))

    this.notify(this.container, 'after-reindex', eventData)
  }

  show (node, callback = () => true) {
    node.addClass('cocooned-visible-item')
    setTimeout(() => {
      callback.call(node)
      node.removeClass('cocooned-hidden-item')
    }, 500)
  }

  hide (node, callback = () => true) {
    node.removeClass('cocooned-visible-item').addClass('cocooned-hidden-item')
    setTimeout(() => callback.call(node), 500)
  }
}

export default reorderableMixin
