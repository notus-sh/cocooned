/* global given */

import Emitter from '@notus.sh/cocooned/src/cocooned/emitter'

import itBehavesLikeAnEventEmitter from '@cocooned/tests/unit/shared/events/emitter'

describe('Emitter', () => {
  itBehavesLikeAnEventEmitter({ emitter: (namespaces) => new Emitter(namespaces) })
})
