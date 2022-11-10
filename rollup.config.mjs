import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import terser from '@rollup/plugin-terser'
import analyze from 'rollup-plugin-analyzer'

import pkg from './package.json' assert { type: "json" }


// browser & node friendly UMD build
const umdConfig = {
  input: 'src/index.ts',
  output: {
    name: 'railID',
    file: pkg.browser,
    format: 'umd'
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    babel({
      presets: ["@babel/preset-env"],
      babelHelpers: 'bundled',
      targets: "defaults or cover 96%"
    }),
    terser(),
    analyze({ limit: 20, summaryOnly: true })
  ]
}

// CommonJS (for Node) and ES module (for bundlers) build.  (We could have three entries in the configuration array
// instead of two, but it's quicker to generate multiple builds from a single configuration where possible, using
// an array for the `output` option, where we can specify `file` and `format` for each target)
const esCjsConfig = {
  input: 'src/index.ts',
  external: [],
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ],
  plugins: [
    typescript(),
    babel({
      presets: ["@babel/preset-env"],
      babelHelpers: 'bundled',
      targets: [
        "maintained node versions",
        "last 3 versions"
      ]
    })
  ]
}

export default cliArgs => {
  // Only produce UMD target if not in watch mode
  return cliArgs.watch ?  [ esCjsConfig ] : [ esCjsConfig, umdConfig ]
}


