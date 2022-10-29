import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

import pkg from './package.json' assert { type: "json" }
import resolveOhm from './src/build/rollup/resolve-ohm-grammar.mjs'

export default [
  // browser & node friendly UMD build
  {
    input: 'src/index.mjs',
    output: {
      name: 'railID',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(),
      resolveOhm(),
      commonjs(),
      babel({ babelHelpers: 'bundled' })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.  (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify `file` and `format` for each target)
  {
    input: 'src/index.mjs',
    external: [],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
        resolveOhm(),
        babel({ babelHelpers: 'bundled' })
      ]
  }
]
