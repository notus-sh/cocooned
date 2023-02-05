/* global given */

import { Base } from '@notus.sh/cocooned/src/cocooned/base'
import { getItem } from '@cocooned/tests/support/selectors'

describe('Cocooned', () => {
  beforeEach(() => {
    document.body.innerHTML = given.html
    const cocooned = new Base(given.container)
    cocooned.start()
  })

  given('container', () => document.querySelector('.cocooned-container'))
  given('html', () => `
    <div class="cocooned-container">
      <div class="cocooned-item">
        <a class="cocooned-remove existing destroyed" href="#">Remove</a>
        <input type="hidden" name="items[0][_destroy]" value="true" />
      </div>
    </div>
  `)

  it('hides items marked for destruction', () => {
    expect(getItem(document).classList).toContain('cocooned-item--hidden')
  })
})
