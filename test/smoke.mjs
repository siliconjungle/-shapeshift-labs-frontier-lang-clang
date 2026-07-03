import assert from 'node:assert/strict';
import {
  ClangLanguagePackage,
  ClangParserAstFormat,
  ClangSourceLanguage,
  createClangNativeImporterAdapter,
  createClangLanguageCapabilityMatrix,
  importClangSource,
  createClangSemanticImportSidecar
} from '../dist/index.js';

const ast = {
  kind: 'TranslationUnitDecl',
  inner: [{
    kind: 'FunctionDecl',
    name: 'from_c',
    type: { qualType: 'int (void)' },
    isThisDeclarationADefinition: true,
    inner: []
  }]
};

const adapter = createClangNativeImporterAdapter();
assert.equal(adapter.language, ClangSourceLanguage);
assert.equal(ClangLanguagePackage.parserAstFormat, ClangParserAstFormat);
assert.equal(ClangLanguagePackage.version, '0.1.20');
assert.equal(ClangLanguagePackage.compilerVersion, '0.2.351');

const imported = await importClangSource({
  sourcePath: 'src/todo.c',
  sourceText: "int from_c(void) { return 0; }\n",
  ast
});

assert.equal(imported.adapter.parser, 'clang');
assert.equal(imported.metadata.astFormat, 'clang-ast-json');
assert.equal(imported.semanticIndex.symbols.some((symbol) => symbol.name === 'from_c' && symbol.kind === 'function'), true);
assert.equal(imported.metadata.nativeImportLossSummary.exactAst, true);

const capability = createClangLanguageCapabilityMatrix({ imports: [imported], targets: ['typescript', 'rust'] });
assert.equal(capability.kind, 'frontier.lang.universalCapabilityMatrix');
assert.equal(capability.languages.some((row) => row.language === 'c'), true);
assert.equal(capability.languages.some((row) => row.language === 'cpp'), true);
assert.equal(capability.summary.imports, 1);
assert.equal(capability.languages.find((row) => row.language === 'c')?.projection.summary.targetEntries, 2);
assert.equal(capability.languages.find((row) => row.language === 'cpp')?.projection.summary.targetEntries, 2);

const sidecar = await createClangSemanticImportSidecar({
  sourcePath: 'src/todo.c',
  sourceText: "int from_c(void) { return 0; }\n",
  ast
}, { id: 'clang-sidecar', regionPrefix: 'clang' });

assert.equal(sidecar.id, 'clang-sidecar');
assert.equal(sidecar.symbols.some((symbol) => symbol.name === 'from_c'), true);

let parserCalls = 0;
const importedFromParser = await importClangSource({
  sourcePath: 'src/todo.cpp',
  sourceText: "int from_cpp(void) { return 1; }\n",
  language: 'cpp',
  importerOptions: {
    parserOptions: { compileCommandsPath: 'compile_commands.json' },
    parse(sourceText, parserOptions) {
      parserCalls += 1;
      assert.equal(sourceText, "int from_cpp(void) { return 1; }\n");
      assert.equal(parserOptions.language, 'cpp');
      assert.equal(parserOptions.compileCommandsPath, 'compile_commands.json');
      return {
        kind: 'TranslationUnitDecl',
        inner: [{
          kind: 'FunctionDecl',
          name: 'from_cpp',
          type: { qualType: 'int (void)' },
          isThisDeclarationADefinition: true,
          inner: []
        }]
      };
    }
  }
});

assert.equal(parserCalls, 1);
assert.equal(importedFromParser.language, 'cpp');
assert.equal(importedFromParser.semanticIndex.symbols.some((symbol) => symbol.name === 'from_cpp'), true);
console.log('@shapeshift-labs/frontier-lang-clang smoke ok');
