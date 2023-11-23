(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Cocooned = factory());
})(this, (function () { 'use strict';

  class Emitter {
    constructor (namespaces = ['cocooned']) {
      this.#namespaces = namespaces;
    }

    emit (target, type, detail = {}) {
      return !this.#emitted(target, type, detail).some(e => e.defaultPrevented)
    }

    /* Protected and private attributes and methods */
    #namespaces

    #emitted (target, type, detail = {}) {
      const events = this.#events(type, detail);
      events.forEach(e => this.#dispatch(target, e));

      return events
    }

    #dispatch (target, event) {
      return target.dispatchEvent(event)
    }

    #events (type, detail) {
      return this.#namespaces.map(ns => this.#event(`${ns}:${type}`, detail))
    }

    #event (type, detail) {
      return new CustomEvent(type, { bubbles: true, cancelable: true, detail })
    }
  }

  // Borrowed from <https://stackoverflow.com/a/2117523>
  function uuidv4 () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  function hideMarkedForDestruction (cocooned, items) {
    items.forEach(item => {
      const destroy = item.querySelector('input[type=hidden][name$="[_destroy]"]');
      if (destroy === null) {
        return
      }
      if (destroy.getAttribute('value') !== 'true') {
        return
      }

      cocooned.hide(item, { animate: false });
    });
  }

  function defaultAnimator (item, fetch = false) {
    if (fetch) {
      item.dataset.cocoonedScrollHeight = item.scrollHeight;
    }

    return [
      { height: `${item.dataset.cocoonedScrollHeight}px`, opacity: 1 },
      { height: `${item.dataset.cocoonedScrollHeight}px`, opacity: 0 },
      { height: 0, opacity: 0 }
    ]
  }

  const instances = Object.create(null);

  class Base {
    static get defaultOptions () {
      const element = document.createElement('div');
      return {
        animate: ('animate' in element && typeof element.animate === 'function'),
        animator: defaultAnimator,
        duration: 450
      }
    }

    static get eventNamespaces () {
      return ['cocooned']
    }

    static get selectors () {
      return {
        container: ['[data-cocooned-container]', '.cocooned-container'],
        item: ['[data-cocooned-item]', '.cocooned-item']
      }
    }

    static getInstance (uuid) {
      return instances[uuid]
    }

    constructor (container, options) {
      this._container = container;
      this._uuid = uuidv4();
      this._options = this.constructor._normalizeOptions({
        ...this.constructor.defaultOptions,
        ...('cocoonedOptions' in container.dataset ? JSON.parse(container.dataset.cocoonedOptions) : {}),
        ...(options || {})
      });
    }

    get container () {
      return this._container
    }

    get options () {
      return this._options
    }

    start () {
      this.container.dataset.cocoonedContainer = true;
      this.container.dataset.cocoonedUuid = this._uuid;
      instances[this._uuid] = this;

      const hideDestroyed = () => { hideMarkedForDestruction(this, this.items); };

      hideDestroyed();
      this.container.ownerDocument.addEventListener('page:load', hideDestroyed);
      this.container.ownerDocument.addEventListener('turbo:load', hideDestroyed);
      this.container.ownerDocument.addEventListener('turbolinks:load', hideDestroyed);
    }

    notify (node, eventType, eventData) {
      return this._emitter.emit(node, eventType, eventData)
    }

    /* Selections methods */
    get items () {
      return Array.from(this.container.querySelectorAll(this._selector('item')))
        .filter(item => this.toContainer(item) === this.container)
        .filter(item => !('display' in item.style && item.style.display === 'none'))
    }

    toContainer (node) {
      return node.closest(this._selector('container'))
    }

    toItem (node) {
      return node.closest(this._selector('item'))
    }

    contains (node) {
      return this.items.includes(this.toItem(node))
    }

    hide (item, options = {}) {
      const opts = this._animationOptions(options);
      const keyframes = opts.animator(item, true);
      const after = () => { item.style.display = 'none'; };

      if (!opts.animate) {
        return Promise.resolve(after()).then(() => item)
      }
      return item.animate(keyframes, opts.duration).finished.then(after).then(() => item)
    }

    show (item, options = {}) {
      const opts = this._animationOptions(options);
      const keyframes = opts.animator(item, false).reverse();
      const before = () => { item.style.display = null; };

      const promise = Promise.resolve(before());
      if (!opts.animate) {
        return promise.then(() => item)
      }
      return promise.then(() => item.animate(keyframes, opts.duration).finished).then(() => item)
    }

    /* Protected and private attributes and methods */
    static _normalizeOptions (options) {
      return options
    }

    _container
    _options
    __uuid
    __emitter

    get _emitter () {
      if (typeof this.__emitter === 'undefined') {
        this.__emitter = new Emitter(this.constructor.eventNamespaces);
      }

      return this.__emitter
    }

    _selectors (name) {
      return this.constructor.selectors[name]
    }

    _selector (name) {
      return this._selectors(name).join(', ')
    }

    _animationOptions (options) {
      const defaults = (({ animate, animator, duration }) => ({ animate, animator, duration }))(this._options);
      return { ...defaults, ...options }
    }
  }

  class Trigger {
    constructor (trigger, cocooned) {
      this._trigger = trigger;
      this._cocooned = cocooned;
    }

    get trigger () {
      return this._trigger
    }

    handle (event) {
      throw new TypeError('handle() must be defined in subclasses')
    }

    /* Protected and private attributes and methods */
    _cocooned
    _trigger

    get _item () {
      return this._cocooned.toItem(this._trigger)
    }

    get _notified () {
      return this._item
    }

    _notify (eventName, originalEvent) {
      return this._cocooned.notify(this._notified, eventName, this._eventData(originalEvent))
    }

    _eventData (originalEvent) {
      return { link: this._trigger, node: this._item, cocooned: this._cocooned, originalEvent }
    }

    _hide (node, callback) {
      return this._cocooned.hide(node, callback)
    }

    _show (node, callback) {
      return this._cocooned.show(node, callback)
    }
  }

  /**
   * Borrowed from Lodash
   * See https://lodash.com/docs/#escapeRegExp
   */
  const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  const reHasRegExpChar = RegExp(reRegExpChar.source);

  class Replacement {
    attribute

    constructor (attribute, name, startDelimiter, endDelimiter = null) {
      this.attribute = attribute;

      this.#name = name;
      this.#startDelimiter = startDelimiter;
      this.#endDelimiter = endDelimiter || startDelimiter;
    }

    apply (node, id) {
      const value = node.getAttribute(this.attribute);
      if (!this.#regexp.test(value)) {
        return
      }

      node.setAttribute(this.attribute, value.replace(this.#regexp, this.#replacement(id)));
    }

    /* Protected and private attributes and methods */
    #name
    #startDelimiter
    #endDelimiter

    #replacement (id) {
      return `${this.#startDelimiter}${id}${this.#endDelimiter}$1`
    }

    get #regexp () {
      const escaped = this.#escape(`${this.#startDelimiter}${this.#name}${this.#endDelimiter}`);
      return new RegExp(`${escaped}(.*?)`, 'g')
    }

    #escape (string) {
      return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : (string || '')
    }
  }

  class Builder {
    constructor (documentFragment, association) {
      this.#documentFragment = documentFragment;
      this.#association = association;
      this.#replacements = [
        new Replacement('for', association, '_'),
        new Replacement('id', association, '_'),
        new Replacement('name', association, '[', ']')
      ];
    }

    build (id) {
      const node = this.#documentFragment.cloneNode(true);
      this.#replacements.forEach(replacement => {
        node.querySelectorAll(`*[${replacement.attribute}]`).forEach(node => replacement.apply(node, id));
      });

      return node
    }

    /* Protected and private attributes and methods */
    #association
    #documentFragment
    #replacements
  }

  class Traverser {
    constructor (origin, traversal) {
      this.#origin = origin;
      this.#traversal = traversal;
    }

    resolve (selector) {
      if (this.#traversal in this.#origin && typeof this.#origin[this.#traversal] === 'function') {
        return this._tryMethod(this.#traversal, selector)
      }

      if (this.#traversal in this.#origin) {
        return this._tryProperty(this.#traversal)
      }

      const method = `_${this.#traversal}`;
      if (method in this) {
        return this[method](selector)
      }

      return null
    }

    /* Protected and private attributes and methods */
    #origin
    #traversal

    _tryMethod (method, selector) {
      try {
        const resolved = this.#origin[method](selector);
        if (resolved instanceof HTMLElement) {
          return resolved
        }
      } catch (e) {}

      return null
    }

    _tryProperty (property) {
      const resolved = this.#origin[property];
      if (resolved instanceof HTMLElement) {
        return resolved
      }

      return null
    }

    _parent (selector) {
      if (this.#origin.parentElement.matches(selector)) {
        return this.#origin.parentElement
      }
      return null
    }

    _prev (selector) {
      if (this.#origin.previousElementSibling.matches(selector)) {
        return this.#origin.previousElementSibling
      }
      return null
    }

    _next (selector) {
      if (this.#origin.nextElementSibling.matches(selector)) {
        return this.#origin.nextElementSibling
      }
      return null
    }

    _siblings (selector) {
      return this.#origin.parentElement.querySelector(selector)
    }
  }

  class Deprecator {
    logger
    package
    version

    constructor (version, packageName, logger) {
      this.version = version;
      this.package = packageName;
      this.logger = logger;
    }

    warn (message, replacement = null) {
      if (message in this.#emitted) {
        return
      }

      const warning = `${message}. It will be removed from ${this.package} ${this.version}`;
      const alternative = (replacement !== null ? `, use ${replacement} instead` : '');
      this.logger.warn(`DEPRECATION WARNING: ${warning}${alternative}.`);

      this.#emitted[message] = true;
    }

    /* Protected and private attributes and methods */
    #emitted = Object.create(null)
  }

  const deprecators = Object.create(null);

  function deprecator (version, packageName = 'Cocooned', logger = console) {
    const hash = [version, packageName].join('#');
    if (!(hash in deprecators)) {
      deprecators[hash] = new Deprecator(version, packageName, logger);
    }

    return deprecators[hash]
  }

  class Extractor {
    constructor (trigger) {
      this.#trigger = trigger;
    }

    extract () {
      return ['builder', 'count', 'node', 'method'].reduce((options, option) => {
        // Sadly, this does not seem to work with #privateMethods
        const method = `_extract${option.charAt(0).toUpperCase() + option.slice(1)}`;
        const extracted = this[method]();
        if (extracted !== null) {
          options[option] = extracted;
        }

        return options
      }, {})
    }

    /* Protected and private attributes and methods */
    #trigger

    get #dataset () {
      return this.#trigger.dataset
    }

    _extractBuilder () {
      if (!('template' in this.#dataset && 'association' in this.#dataset)) {
        return null
      }

      const template = document.querySelector(`template[data-name="${this.#dataset.template}"]`);
      if (template === null) {
        return null
      }

      return new Builder(template.content, `new_${this.#dataset.association}`)
    }

    _extractCount () {
      if ('associationInsertionCount' in this.#dataset) {
        return parseInt(this.#dataset.associationInsertionCount, 10)
      }

      if ('count' in this.#dataset) {
        return parseInt(this.#dataset.count, 10)
      }

      return null
    }

    _extractMethod () {
      if ('associationInsertionMethod' in this.#dataset) {
        return this.#dataset.associationInsertionMethod
      }

      return 'before'
    }

    _extractNode () {
      if (!('associationInsertionNode' in this.#dataset)) {
        return this.#trigger.parentElement
      }

      const node = this.#dataset.associationInsertionNode;
      if (node === 'this') {
        return this.#trigger
      }

      if (!('associationInsertionTraversal' in this.#dataset)) {
        return this.#trigger.ownerDocument.querySelector(node)
      }

      deprecator('3.0').warn('associationInsertionTraversal is deprecated');
      const traverser = new Traverser(this.#trigger, this.#dataset.associationInsertionTraversal);

      return traverser.resolve(node)
    }
  }

  class Validator {
    static validates (options) {
      const validator = new Validator(options);
      return validator.validates()
    }

    constructor (options) {
      this.#options = options;
    }

    validates () {
      const optionNames = new Set(Object.keys(this.#options));
      const expected = new Set(['builder', 'count', 'node', 'method']);
      const missing = new Set(Array.from(expected.values()).filter(key => !optionNames.has(key)));

      if (missing.size !== 0) {
        throw new TypeError(`Missing options: ${Array.from(missing.values()).join(', ')}`)
      }

      this._validateBuilder();
      this._validateMethod();
    }

    /* Protected and private attributes and methods */
    #options

    _validateBuilder () {
      const builder = this.#options.builder;
      if (!(builder instanceof Builder)) {
        throw new TypeError(
          `Invalid builder option: instance of Builder expected, got ${builder.constructor.name}`
        )
      }
    }

    _validateMethod () {
      const method = this.#options.method;
      const supported = ['after', 'before', 'append', 'prepend', 'replaceWith'];

      if (!supported.includes(method)) {
        throw new TypeError(
          `Invalid method option: expected one of ${supported.join(', ')}, got ${method}`
        )
      }
    }
  }

  let counter = 0;

  function uniqueId () {
    return `${new Date().getTime()}${counter++}`
  }

  class Add extends Trigger {
    static create (trigger, cocooned) {
      const extractor = new Extractor(trigger);
      return new Add(trigger, cocooned, extractor.extract())
    }

    constructor (trigger, cocooned, options = {}) {
      super(trigger, cocooned);

      this.#options = { ...this.#options, ...options };
      Validator.validates(this.#options);
    }

    get insertionNode () {
      return this.#options.node
    }

    handle (event) {
      for (let i = 0; i < this.#options.count; i++) {
        this.#item = this._build();

        // Insert can be prevented through a 'cocooned:before-insert' event handler
        if (!this._notify('before-insert', event)) {
          return false
        }

        this._insert();
        this._notify('after-insert', event);
      }
    }

    /* Protected and private attributes and methods */
    #item
    #options = {
      count: 1
      // Other expected options:
      // builder: A Builder instance
      // method: Insertion method (one of: append, prepend, before, after, replaceWith)
      // node: Insertion Node as a DOM Element
    }

    get _item () {
      return this.#item
    }

    get _notified () {
      return this.#options.node
    }

    _insert () {
      this.#options.node[this.#options.method](this._item);
    }

    _build () {
      return this.#options.builder.build(uniqueId()).firstElementChild
    }
  }

  class Remove extends Trigger {
    handle (event) {
      // Removal can be prevented through a 'cocooned:before-remove' event handler
      if (!this._notify('before-remove', event)) {
        return false
      }

      this._hide(this._item).then(() => {
        this._remove();
        this._notify('after-remove', event);
      });
    }

    /* Protected and private attributes and methods */
    #notified

    // Dynamic nodes are plainly removed from document, so we need to trigger
    // events on their parent and memoize it so we still can find it after removal
    get _notified () {
      if (typeof this.#notified === 'undefined') {
        this.#notified = this._item.parentElement;
      }

      return this.#notified
    }

    _remove () {
      this._removable() ? this._item.remove() : this._markForDestruction();
    }

    _removable () {
      return this._trigger.matches('.dynamic') ||
        ('cocoonedPersisted' in this._trigger.dataset && this._trigger.dataset.cocoonedPersisted === 'false')
    }

    _markForDestruction () {
      this._item.querySelector('input[type=hidden][name$="[_destroy]"]').setAttribute('value', 'true');
      this._item.querySelectorAll('input[required], select[required]')
        .forEach(input => input.removeAttribute('required'));
    }
  }

  function clickHandler$1 (callback) {
    return e => {
      e.preventDefault();
      callback(e);
    }
  }

  function delegatedClickHandler (selector, callback) {
    const handler = clickHandler$1(callback);

    return e => {
      const { target } = e;
      if (target.closest(selector) === null) {
        return
      }

      handler(e);
    }
  }

  function itemDelegatedClickHandler (container, selector, callback) {
    const delegatedHandler = delegatedClickHandler(selector, callback);

    return e => {
      if (!container.contains(e.target)) {
        return
      }

      delegatedHandler(e);
    }
  }

  const coreMixin = (Base) => class extends Base {
    static get selectors () {
      return {
        ...super.selectors,
        'triggers.add': ['[data-cocooned-trigger="add"]', '.cocooned-add'],
        'triggers.remove': ['[data-cocooned-trigger="remove"]', '.cocooned-remove']
      }
    }

    start () {
      super.start();

      this.addTriggers = Array.from(this.container.ownerDocument.querySelectorAll(this._selector('triggers.add')))
        .map(element => Add.create(element, this))
        .filter(trigger => this.toContainer(trigger.insertionNode) === this.container);

      this.addTriggers.forEach(add => add.trigger.addEventListener(
        'click',
        clickHandler$1((e) => add.handle(e))
      ));

      this.container.addEventListener(
        'click',
        itemDelegatedClickHandler(this, this._selector('triggers.remove'), (e) => {
          const trigger = new Remove(e.target, this);
          trigger.handle(e);
        })
      );
    }
  };

  let Cocooned$1 = class Cocooned extends coreMixin(Base) {
    static create (container, options) {
      if ('cocoonedUuid' in container.dataset) {
        return Cocooned.getInstance(container.dataset.cocoonedUuid)
      }

      const cocooned = new this.constructor(container, options);
      cocooned.start();

      return cocooned
    }

    static start () {
      document.querySelectorAll('[data-cocooned-container], [data-cocooned-options]')
        .forEach(element => this.constructor.create(element));
    }
  };

  const limitMixin = (Base) => class extends Base {
    static get defaultOptions () {
      return { ...super.defaultOptions, ...{ limit: false } }
    }

    start () {
      super.start();
      if (this.options.limit === false) {
        return
      }

      this.container.addEventListener('cocooned:before-insert', e => {
        if (this.items.length < this.options.limit) {
          return
        }

        e.preventDefault();
        this.notify(this.container, 'limit-reached', e.detail);
      });
    }
  };

  class Move extends Trigger {
    handle (event) {
      if (this._pivotItem === null) {
        return
      }

      // Moves can be prevented through a 'cocooned:before-move' event handler
      if (!this._notify('before-move', event)) {
        return false
      }

      this._hide(this._item).then(() => {
        this._move();
        this._show(this._item).then(() => this._notify('after-move', event));
      });
    }

    /* Protected and private attributes and methods */
    get _pivotItem () {
      throw new TypeError('_pivotItem() must be defined in subclasses')
    }

    _move () {
      throw new TypeError('_move() must be defined in subclasses')
    }

    _findPivotItem (origin, method) {
      let sibling = origin;

      do {
        sibling = sibling[method];
        if (sibling !== null && this._cocooned.contains(sibling)) {
          break
        }
      } while (sibling !== null)

      return sibling
    }
  }

  class Up extends Move {
    /* Protected and private attributes and methods */
    #pivotItem

    get _pivotItem () {
      if (typeof this.#pivotItem === 'undefined') {
        this.#pivotItem = this._findPivotItem(this._item, 'previousElementSibling');
      }

      return this.#pivotItem
    }

    _move () {
      this._pivotItem.before(this._item);
    }
  }

  class Down extends Move {
    /* Protected and private attributes and methods */
    #pivotItem

    get _pivotItem () {
      if (typeof this.#pivotItem === 'undefined') {
        this.#pivotItem = this._findPivotItem(this._item, 'nextElementSibling');
      }

      return this.#pivotItem
    }

    _move () {
      this._pivotItem.after(this._item);
    }
  }

  class Reindexer {
    constructor (cocooned, startAt = 0) {
      this.#cocooned = cocooned;
      this.#startAt = startAt;
    }

    reindex (event) {
      // Reindex can be prevented through a 'cocooned:before-reindex' event handler
      if (!this.#notify('before-reindex', event)) {
        return false
      }

      this.#positionFields.forEach((field, i) => field.setAttribute('value', i + this.#startAt));
      this.#notify('after-reindex', event);
    }

    /* Protected and private attributes and methods */
    #cocooned
    #startAt

    get #positionFields () {
      return this.#nodes.map(node => node.querySelector('input[name$="[position]"]'))
    }

    get #nodes () {
      return this.#cocooned.items
    }

    #notify (eventName, originalEvent) {
      return this.#cocooned.notify(this.#cocooned.container, eventName, this.#eventData(originalEvent))
    }

    #eventData (originalEvent) {
      return { nodes: this.#nodes, cocooned: this.#cocooned, originalEvent }
    }
  }

  function clickHandler (cocooned, selector, TriggerClass) {
    return itemDelegatedClickHandler(cocooned, selector, (e) => {
      const trigger = new TriggerClass(e.target, cocooned);
      trigger.handle(e);
    })
  }

  const reorderableMixin = (Base) => class extends Base {
    static get defaultOptions () {
      return { ...super.defaultOptions, ...{ reorderable: false } }
    }

    static get selectors () {
      return {
        ...super.selectors,
        'triggers.up': ['[data-cocooned-trigger="up"]', '.cocooned-move-up'],
        'triggers.down': ['[data-cocooned-trigger="down"]', '.cocooned-move-down']
      }
    }

    start () {
      super.start();
      if (this.options.reorderable === false) {
        return
      }

      this.container.addEventListener('cocooned:after-insert', e => this._reindexer.reindex(e));
      this.container.addEventListener('cocooned:after-remove', e => this._reindexer.reindex(e));
      this.container.addEventListener('cocooned:after-move', e => this._reindexer.reindex(e));
      const form = this.container.closest('form');
      if (form !== null) {
        form.addEventListener('submit', e => this._reindexer.reindex(e));
      }

      this.container.addEventListener('click', clickHandler(this, this._selector('triggers.up'), Up));
      this.container.addEventListener('click', clickHandler(this, this._selector('triggers.down'), Down));
    }

    /* Protected and private attributes and methods */
    static _normalizeOptions (options) {
      const normalized = super._normalizeOptions(options);
      if (typeof normalized.reorderable === 'boolean' && normalized.reorderable) {
        normalized.reorderable = { startAt: 1 };
      }

      return normalized
    }

    #reindexer

    get _reindexer () {
      if (typeof this.#reindexer === 'undefined') {
        this.#reindexer = new Reindexer(this, this.options.reorderable.startAt);
      }

      return this.#reindexer
    }
  };

  const cocoonSupportMixin = (Base) => class extends Base {
    static get eventNamespaces () {
      return [...super.eventNamespaces, 'cocoon']
    }

    static get selectors () {
      const selectors = super.selectors;
      selectors.item.push('.nested-fields');
      selectors['triggers.add'].push('.add_fields');
      selectors['triggers.remove'].push('.remove_fields');

      return selectors
    }
  };

  const findInsertionNode = function (trigger, $) {
    const insertionNode = trigger.data('association-insertion-node');
    const insertionTraversal = trigger.data('association-insertion-traversal');

    if (!insertionNode) return trigger.parent()
    if (typeof insertionNode === 'function') return insertionNode(trigger)
    if (insertionTraversal) return trigger[insertionTraversal](insertionNode)
    return insertionNode === 'this' ? trigger : $(insertionNode)
  };

  const findContainer = function (trigger, $) {
    const $trigger = $(trigger);
    const insertionNode = findInsertionNode($trigger, $);
    const insertionMethod = $trigger.data('association-insertion-method') || 'before';

    if (['before', 'after', 'replaceWith'].includes(insertionMethod)) return insertionNode.parent()
    return insertionNode
  };

  const cocoonAutoStart = function (jQuery) {
    jQuery('.add_fields')
      .map((_i, adder) => findContainer(adder, jQuery))
      .each((_i, container) => jQuery(container).cocooned());
  };

  class Cocooned extends reorderableMixin(limitMixin(cocoonSupportMixin(Cocooned$1))) {
    static create (container, options = {}) {
      if ('cocoonedUuid' in container.dataset) {
        return Cocooned.getInstance(container.dataset.cocoonedUuid)
      }

      const cocooned = new Cocooned(container, options);
      cocooned.start();

      return cocooned
    }

    static start () {
      document.querySelectorAll('[data-cocooned-container], [data-cocooned-options]')
        .forEach(element => Cocooned.create(element));
    }
  }

  const jQueryPluginMixin = function (jQuery, Cocooned) {
    jQuery.fn.cocooned = function (options) {
      return this.each((_i, el) => Cocooned.create(el, options))
    };
  };

  /* global jQuery, $ */

  // Expose a jQuery plugin
  jQueryPluginMixin(jQuery, Cocooned);

  // On-load initialization
  const cocoonedAutoStart = () => Cocooned.start();
  $(cocoonedAutoStart);

  $(() => cocoonAutoStart($));

  deprecator('3.0').warn(
    'Loading @notus.sh/cocooned/cocooned is deprecated',
    '@notus.sh/cocooned/jquery, @notus.sh/cocooned or `@notus.sh/cocooned/src/cocooned/cocooned`'
  );

  return Cocooned;

}));
