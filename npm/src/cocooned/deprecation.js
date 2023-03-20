import { Traverser } from './deprecation/traverser.js'

class Deprecator {
  logger
  package
  version

  constructor (version, packageName, logger) {
    this.version = version
    this.package = packageName
    this.logger = logger
  }

  warn (message, replacement = null) {
    if (message in this.#emitted) {
      return
    }

    const warning = `${message}. It will be removed from ${this.package} ${this.version}`
    const alternative = (replacement !== null ? `, use ${replacement} instead` : '')
    this.logger.warn(`DEPRECATION WARNING: ${warning}${alternative}.`)

    this.#emitted[message] = true
  }

  /* Protected and private attributes and methods */
  #emitted = Object.create(null)
}

const deprecators = Object.create(null)

function deprecator (version, packageName = 'Cocooned', logger = console) {
  const hash = [version, packageName].join('#')
  if (!(hash in deprecators)) {
    deprecators[hash] = new Deprecator(version, packageName, logger)
  }

  return deprecators[hash]
}

export {
  deprecator,
  Traverser
}
