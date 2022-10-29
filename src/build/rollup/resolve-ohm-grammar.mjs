//
// Rollup plugin to allow importing Ohm grammars using standard ES6 `import` syntax:
// 
// `import myGrammar from './my-grammar.ohm'
// 
// The resulting `myGrammar` variable is a string representing the content of the
// grammar file to be passed to `ohm.grammar(..)`.
// 
// The above `import` example will alternatively resolve `./my-grammar.ohm.mjs`
// which allows for 'dynamic grammars' (i.e. ES6 modules whose default export
// is the grammar string). These modules will be evaluated at build time, which
// enables programmatically generated grammars with zero-cost at runtime.
//

const matchRaw = s => /\.ohm$/gi.test(s)
const matchModule = s => /\.ohm\.mjs/gi.test(s)

async function importFresh(path) {
  return (await import(`${path}?update=${Date.now()}`)).default
}

export default function resolveOhmGrammar() {
  return {
    name: 'resolve-ohm-grammar',
    async load(id) {
      return matchModule(id) ? importFresh(id) : null
    },
    async transform(code, id) {
      if (matchRaw(id) || matchModule(id)) {
        return `export default \`${code}\``
      }
    }
  }
}