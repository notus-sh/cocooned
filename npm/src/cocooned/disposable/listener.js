import { disposable } from "../disposable.js";

class Listener {
  constructor (eventTarget, type, listener) {
    this.#eventTarget = eventTarget
    this.#type = type
    this.#listener = listener

    this.#eventTarget.addEventListener(this.#type, this.#listener)
  }

  dispose () {
    this.#eventTarget.removeEventListener(this.#type, this.#listener)
  }

  /* Protected and private attributes and methods */
  #eventTarget
  #type
  #listener
}

disposable(Listener)

export {
  Listener
}
