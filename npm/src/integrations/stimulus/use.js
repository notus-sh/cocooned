import Cocooned from './../../../index.js'
import { Listener } from './../../cocooned/disposable.js'

const defaultEvents = [
  'afterInsert',
  'afterMove',
  'afterRemove',
  'beforeInsert',
  'beforeMove',
  'beforeRemove',
  'limitReached'
]

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
    ...events.reduce((handlers, methodName) => ({ ...handlers, [methodName]: (event) => {} }), {})
  }
  const start = () => {
    cocooned.create(element, cocoonedOptions)
    events.forEach(methodName => {
      disposer.use(new Listener(element, `cocooned:${dasherize(methodName)}`, (event) => {
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
