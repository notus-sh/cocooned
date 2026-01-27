import Cocooned from './jquery.js'
import { deprecator } from './src/cocooned/deprecation.js'

deprecator('4.0').warn(
  'Loading @notus.sh/cocooned/cocooned is deprecated',
  '@notus.sh/cocooned/jquery, @notus.sh/cocooned or `@notus.sh/cocooned/src/cocooned/cocooned`'
)

export default Cocooned
