import assert from 'node:assert/strict';
import { importClangSource, createClangSemanticImportSidecar } from '../dist/index.js';

for (let i = 0; i < 40; i += 1) {
  const ast = {
    kind: 'TranslationUnitDecl',
    inner: [{ kind: 'FunctionDecl', name: `from_c_${i}`, type: { qualType: 'int (void)' }, isThisDeclarationADefinition: true, inner: [] }]
  };
  const imported = await importClangSource({
    sourcePath: `src/todo${i}.c`,
    sourceText: `int from_c_${i}(void) { return 0; }`,
    ast
  });
  assert.equal(imported.metadata.astFormat, 'clang-ast-json');
  assert.equal(imported.semanticIndex.symbols.some((symbol) => symbol.name === `from_c_${i}`), true);
  const sidecar = await createClangSemanticImportSidecar({
    sourcePath: `src/todo${i}.c`,
    sourceText: `int from_c_${i}(void) { return 0; }`,
    ast
  }, { id: `clang-fuzz-${i}` });
  assert.equal(sidecar.imports.length, 1);
}

console.log('@shapeshift-labs/frontier-lang-clang fuzz ok');
