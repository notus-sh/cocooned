import { Listener } from './disposable/listener.js'

if (typeof Symbol.dispose !== "symbol") {
  console.warn(`
    Cocooned use Disposable objects but they are not supported by your browser.
    See Cocooned documentation for polyfill options.
  `)
}

function disposable(klass) {
  if (typeof Symbol.dispose !== "symbol") {
    return
  }

  klass.prototype[Symbol.dispose] = klass.prototype.dispose
}

export {
  disposable,
  Listener
}
