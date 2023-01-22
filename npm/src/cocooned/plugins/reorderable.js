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
    this.container.get(0).addEventListener('cocooned:after-insert', e => this.reindex(e))
    this.container.get(0).addEventListener('cocooned:after-remove', e => this.reindex(e))
    this.container.get(0).addEventListener('cocooned:after-move', e => this.reindex(e))
    // Ensure positions are unique before save
    const form = this.container.get(0).closest('form')
    if (form !== null) {
      form.addEventListener('submit', e => this.reindex(e))
    }

    // Move items
    const self = this
    this.container.get(0).addEventListener('click', function (e) {
      const { target } = e
      if (!target.matches(self.selector('up')) && !target.matches(self.selector('down'))) {
        return
      }

      e.preventDefault()
      const up = self.classes.up.some(c => target.className.indexOf(c) !== -1)
      self.move(target, up ? 'up' : 'down', e)
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

export {
  reorderableMixin
}
