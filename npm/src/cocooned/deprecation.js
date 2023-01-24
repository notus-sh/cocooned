import { Traverser } from './deprecation/traverser'

class Deprecator {
  #emitted = Object.create(null)

  logger
  package
  version

  constructor(version, packageName, logger) {
    this.version = version
    this.package = packageName
    this.logger = logger
  }

  warn (message, replacement = null) {
    if (message in this.#emitted) {
      return;
    }

    const warning = `DEPRECATION WARNING: ${message}. It will be removed from ${this.package} ${this.version}`
    const alternative = (replacement !== null ? `, use ${replacement} instead` : '')
    this.logger.warn(`DEPRECATION WARNING: ${warning}${alternative}.`)

    this.#emitted[message] = true
  }
}

const deprecators = Object.create(null)

function deprecator(version, packageName = 'Cocooned', logger = console) {
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
