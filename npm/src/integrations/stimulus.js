import { Controller } from '@hotwired/stimulus'
import { useCocooned } from './stimulus/use.js'

const registerCocoonedController = function (application) {
  return application.register("cocooned", class extends Controller {
    connect() {
      useCocooned(this)
    }
  })
}

export {
  registerCocoonedController,
  useCocooned
}
