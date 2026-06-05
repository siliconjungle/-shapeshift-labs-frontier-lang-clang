import { performance } from 'node:perf_hooks';
import { importClangSource } from '../dist/index.js';

const iterations = 100;
const started = performance.now();
let symbols = 0;
for (let i = 0; i < iterations; i += 1) {
  const ast = {
    kind: 'TranslationUnitDecl',
    inner: [{ kind: 'FunctionDecl', name: `from_c_${i}`, type: { qualType: 'int (void)' }, isThisDeclarationADefinition: true, inner: [] }]
  };
  const imported = await importClangSource({
    sourcePath: `src/todo${i}.c`,
    sourceText: `int from_c_${i}(void) { return 0; }`,
    ast
  });
  symbols += imported.semanticIndex.symbols.length;
}
const elapsedMs = performance.now() - started;
console.log(JSON.stringify({
  package: '@shapeshift-labs/frontier-lang-clang',
  iterations,
  elapsedMs: Number(elapsedMs.toFixed(3)),
  importsPerSecond: Number((iterations / (elapsedMs / 1000)).toFixed(2)),
  symbols
}, null, 2));
