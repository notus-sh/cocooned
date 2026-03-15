import { defineConfig } from 'eslint/config'
import neostandard from 'neostandard'
import importX from 'eslint-plugin-import-x'
import jest from 'eslint-plugin-jest'
import jestDom from 'eslint-plugin-jest-dom'

export default defineConfig([
  neostandard({ env: ['browser'] }),
  {
    plugins: {
      'import-x': importX
    },
    rules: {
      'import-x/export': 'error',
      'import-x/first': 'error',
      'import-x/no-absolute-path': ['error', { esmodule: true, commonjs: true, amd: false }],
      'import-x/no-duplicates': 'error',
      'import-x/no-named-default': 'error',
      'import-x/no-webpack-loader-syntax': 'error',
    }
  },
  {
    files: ["npm/__tests__/{features,integration,shared,unit}/**/*.js"],
    extends: [
      jest.configs["flat/recommended"],
      jestDom.configs["flat/recommended"]
    ]
  }
])
