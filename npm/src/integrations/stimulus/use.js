import Cocooned from './../../../index.js'
import { Listener } from './../../cocooned/disposable.js'

const defaultEvents = [
  'after-insert',
  'after-move',
  'after-remove',
  'before-insert',
  'before-move',
  'before-remove',
  'limit-reached'
]

function camelize(dashSeparated) {
  return dashSeparated.toLowerCase().replace(/-(.)/g, function(match, group1) {
    return group1.toUpperCase();
  });
}

const dasherize = function (camelCase) {
  return camelCase.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
}

const useCocooned = function (controller, options = {}) {
  const cocooned = options.cocooned ?? Cocooned
  const cocoonedOptions = options.options ?? {}
  const element = options.element ?? controller.element
  const events = options.events ?? defaultEvents

  const disconnect = controller.disconnect.bind(controller)
  const disposer = new DisposableStack()
  const methods = {
    cocooned: () => cocooned.getInstance(element.dataset.cocoonedUuid),
    disconnect: () => {
      disposer.dispose()
      disconnect()
    },
    ...events
        .map(eventName => camelize(eventName))
        .reduce((handlers, methodName) => ({ ...handlers, [methodName]: (event) => {} }), {})
  }
  const start = () => {
    cocooned.create(element, cocoonedOptions)
    events.forEach(eventName => {
      const methodName = camelize(eventName)
      disposer.use(new Listener(element, `cocooned:${eventName}`, (event) => {
        controller[methodName].call(controller, event)
      }))
    })
  }

  Object.assign(controller, methods)
  start()

  return [start, methods.dispose]
}

export {
  useCocooned
}
