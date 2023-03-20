import { Builder } from './builder.js'
import { deprecator, Traverser } from '../../../../deprecation.js'

class Extractor {
  constructor (trigger) {
    this.#trigger = trigger
  }

  extract () {
    return ['builder', 'count', 'node', 'method'].reduce((options, option) => {
      // Sadly, this does not seem to work with #privateMethods
      const method = `_extract${option.charAt(0).toUpperCase() + option.slice(1)}`
      const extracted = this[method]()
      if (extracted !== null) {
        options[option] = extracted
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

    const template = document.querySelector(`template[data-name="${this.#dataset.template}"]`)
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

    const node = this.#dataset.associationInsertionNode
    if (node === 'this') {
      return this.#trigger
    }

    if (!('associationInsertionTraversal' in this.#dataset)) {
      return this.#trigger.ownerDocument.querySelector(node)
    }

    deprecator('3.0').warn('associationInsertionTraversal is deprecated')
    const traverser = new Traverser(this.#trigger, this.#dataset.associationInsertionTraversal)

    return traverser.resolve(node)
  }
}

export {
  Extractor
}
