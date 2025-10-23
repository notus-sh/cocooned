import { defineConfig } from "eslint/config"
import neostandard from 'neostandard'
import jest from "eslint-plugin-jest"
import jestDom from "eslint-plugin-jest-dom"

export default defineConfig([
  neostandard({ env: ['browser'] }),
  {
    files: ["npm/__tests__/{features,integration,shared,unit}/**/*.js"],
    extends: [
      jest.configs["flat/recommended"],
      jestDom.configs["flat/recommended"]
    ]
  }
])
