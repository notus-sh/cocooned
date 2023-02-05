/* global given */

import { Base } from '@notus.sh/cocooned/src/cocooned/base'

describe('Base', () => {
  beforeEach(() => {
    document.body.innerHTML = given.html
    given.instance.start()
  })

  given('instance', () => new Base(given.container))
  given('container', () => document.querySelector('.cocooned-container'))
  given('html', () => `
    <div class="cocooned-container">
    </div>
  `)
})
