/* globals define */

// Use Universal Module Definition pattern to load Cocooned
// See https://github.com/umdjs/umd/blob/master/templates/returnExportsGlobal.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], function (jquery) {
      return (root.Cocooned = factory(jquery))
    })
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('jquery'))
  } else {
    // Browser globals
    root.Cocooned = factory(root.jQuery)
  }
}(typeof self !== 'undefined' ? self : this, function ($) {
  const Cocooned = function (container, options) {
    this.container = $(container)
    const opts = $.extend({}, this.defaultOptions(), (this.container.data('cocooned-options') || {}), (options || {}))

    // Autoload plugins
    for (const pluginName in Cocooned.Plugins) {
      if (Object.prototype.hasOwnProperty.call(Cocooned.Plugins, pluginName)) {
        const plugin = Cocooned.Plugins[pluginName]
        const optionName = pluginName.charAt(0).toLowerCase() + pluginName.slice(1)

        if (opts[optionName] !== false) {
          if (Object.prototype.hasOwnProperty.call(plugin, 'normalizeConfig') &&
              typeof plugin.normalizeConfig === 'function') {
            opts[optionName] = plugin.normalizeConfig(opts[optionName])
          }

          for (const method in plugin) {
            if (method === 'normalizeConfig') {
              continue
            }
            if (!Object.prototype.hasOwnProperty.call(plugin, method) || typeof plugin[method] !== 'function') {
              continue
            }

            this[method] = plugin[method]
          }
        }
      }
    }

    this.options = opts
    this.init()

    this.container.get(0).dataset.cocooned = this
  }

  Cocooned.Plugins = {}
  Cocooned.prototype = {

    elementsCounter: 0,

    // Compatibility with Cocoon
    // TODO: Remove in 3.0 (Only Cocoon namespaces).
    namespaces: {
      events: ['cocooned', 'cocoon']
    },

    // Compatibility with Cocoon
    // TODO: Remove in 3.0 (Only Cocoon class names).
    classes: {
      // Actions link
      add: ['cocooned-add', 'add_fields'],
      remove: ['cocooned-remove', 'remove_fields'],
      up: ['cocooned-move-up'],
      down: ['cocooned-move-down'],
      // Containers
      container: ['cocooned-container'],
      item: ['cocooned-item', 'nested-fields']
    },

    defaultOptions: function () {
      const options = {}

      for (const moduleName in Cocooned.Plugins) {
        if (Object.prototype.hasOwnProperty.call(Cocooned.Plugins, moduleName)) {
          const module = Cocooned.Plugins[moduleName]
          const optionName = moduleName.charAt(0).toLowerCase() + moduleName.slice(1)

          options[optionName] = module.defaultOptionValue
        }
      }

      return options
    },

    notify: function (node, eventType, eventData) {
      return !(this.namespaces.events.some(function (namespace) {
        const namespacedEventType = [namespace, eventType].join(':')
        const event = $.Event(namespacedEventType, eventData)

        node.trigger(event, [eventData.node, eventData.cocooned])

        return (event.isPropagationStopped() || event.isDefaultPrevented())
      }))
    },

    selector: function (type, selector) {
      const s = selector || '&'
      return this.classes[type].map(function (klass) { return s.replace(/&/, '.' + klass) }).join(', ')
    },

    namespacedNativeEvents: function (type) {
      const namespaces = this.namespaces.events.map(function (ns) { return '.' + ns })
      namespaces.unshift(type)
      return namespaces.join('')
    },

    buildId: function () {
      return (new Date().getTime() + this.elementsCounter++)
    },

    buildContentNode: function (content) {
      const id = this.buildId()
      let html = (content || this.content)
      const braced = '[' + id + ']'
      const underscored = '_' + id + '_';

      ['associations', 'association'].forEach(function (a) {
        html = html.replace(this.regexps[a].braced, braced + '$1')
        html = html.replace(this.regexps[a].underscored, underscored + '$1')
      }, this)

      return $(html)
    },

    getInsertionNode: function (adder) {
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
    },

    getInsertionMethod: function (adder) {
      const $adder = $(adder)
      return $adder.data('association-insertion-method') || 'before'
    },

    getItems: function (selector) {
      selector = selector || ''
      const self = this
      return $(this.selector('item', selector), this.container).filter(function () {
        return ($(this).closest(self.selector('container')).get(0) === self.container.get(0))
      })
    },

    findContainer: function (addLink) {
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
    },

    findItem: function (removeLink) {
      return $(removeLink).closest(this.selector('item'))
    },

    init: function () {
      const self = this

      this.addLinks = $(this.selector('add')).filter(function () {
        const container = self.findContainer(this)
        return (container.get(0) === self.container.get(0))
      })

      const addLink = $(this.addLinks.get(0))

      this.content = addLink.data('association-insertion-template')
      this.regexps = {
        association: {
          braced: new RegExp('\\[new_' + addLink.data('association') + '\\](.*?\\s)', 'g'),
          underscored: new RegExp('_new_' + addLink.data('association') + '_(\\w*)', 'g')
        },
        associations: {
          braced: new RegExp('\\[new_' + addLink.data('associations') + '\\](.*?\\s)', 'g'),
          underscored: new RegExp('_new_' + addLink.data('associations') + '_(\\w*)', 'g')
        }
      }

      this.initUi()
      this.bindEvents()
    },

    initUi: function () {
      const self = this

      if (!this.container.attr('id')) {
        this.container.attr('id', this.buildId())
      }
      this.container.addClass(this.classes.container.join(' '))

      $(function () { self.hideMarkedForDestruction() })
      $(document).on('page:load turbolinks:load turbo:load', function () { self.hideMarkedForDestruction() })
    },

    bindEvents: function () {
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
    },

    add: function (adder, originalEvent) {
      const $adder = $(adder)
      const insertionMethod = this.getInsertionMethod($adder)
      const insertionNode = this.getInsertionNode($adder)
      const contentTemplate = $adder.data('association-insertion-template')
      const count = parseInt($adder.data('association-insertion-count'), 10) || parseInt($adder.data('count'), 10) || 1

      for (let i = 0; i < count; i++) {
        const contentNode = this.buildContentNode(contentTemplate)
        const eventData = { link: $adder, node: contentNode, cocooned: this, originalEvent }
        const afterNode = (insertionMethod === 'replaceWith' ? contentNode : insertionNode)

        // Insertion can be prevented through a 'cocooned:before-insert' event handler
        if (!this.notify(insertionNode, 'before-insert', eventData)) {
          return false
        }

        insertionNode[insertionMethod](contentNode)

        this.notify(afterNode, 'after-insert', eventData)
      }
    },

    remove: function (remover, originalEvent) {
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
    },

    hideMarkedForDestruction: function () {
      const self = this
      $(this.selector('remove', '&.existing.destroyed'), this.container).each(function (i, removeLink) {
        const node = self.findItem(removeLink)
        node.hide()
      })
    }
  }

  Cocooned.Plugins.Limit = {

    defaultOptionValue: false,

    bindLimit: function () {
      this.limit = this.options.limit
      this.container.on('cocooned:before-insert', function (e) {
        const cocooned = e.cocooned
        if (cocooned.getLength() < cocooned.limit) {
          return
        }

        e.stopPropagation()
        const eventData = { link: e.link, node: e.node, cocooned, originalEvent: e }
        cocooned.notify(cocooned.container, 'limit-reached', eventData)
      })
    },

    getLength: function () {
      // jQuery :visible selector use element.offset(Width|Height), which is not available in jsdom.
      return this.getItems().filter(function () {
        return $(this).css('display') !== 'none'
      }).length
    }
  }

  Cocooned.Plugins.Reorderable = {

    defaultOptionValue: false,
    defaultConfig: { startAt: 1 },

    normalizeConfig: function (config) {
      if (typeof config === 'boolean' && config) {
        return this.defaultConfig
      }
      return config
    },

    bindReorderable: function () {
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
    },

    move: function (moveLink, direction, originalEvent) {
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
    },

    reindex: function (originalEvent) {
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
    },

    show: function (node, callback) {
      callback = callback || function () { return true }

      node.addClass('cocooned-visible-item')
      setTimeout(function () {
        callback.apply(node)
        node.removeClass('cocooned-hidden-item')
      }, 500)
    },

    hide: function (node, callback) {
      node.removeClass('cocooned-visible-item').addClass('cocooned-hidden-item')
      if (callback) {
        setTimeout(function () {
          callback.apply(node)
        }, 500)
      }
    }
  }

  // Expose a jQuery plugin
  $.fn.cocooned = function (options) {
    return this.each(function () {
      const container = $(this)
      if (typeof container.data('cocooned') !== 'undefined') {
        return
      }

      return new Cocooned(container, options)
    })
  }

  // On-load initialization
  $(function () {
    $('*[data-cocooned-options]').each(function (i, el) {
      $(el).cocooned()
    })
  })

  return Cocooned
}))
