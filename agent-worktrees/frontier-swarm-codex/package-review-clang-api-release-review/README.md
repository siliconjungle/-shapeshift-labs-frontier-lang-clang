# @shapeshift-labs/frontier-lang-clang

Clang AST source-language importer package for Frontier Lang semantic source documents.

Wraps the compiler Clang AST JSON native importer with package-level metadata, import helpers, and semantic sidecar generation for C/C++ translation-unit ASTs.

## Usage

```js
import { importClangSource, createClangSemanticImportSidecar } from '@shapeshift-labs/frontier-lang-clang';

const imported = await importClangSource({
  sourcePath: 'src/todo.c',
  sourceText: "int from_c(void) { return 0; }\n",
  ast: {
    kind: 'TranslationUnitDecl',
    inner: [{
      kind: 'FunctionDecl',
      name: 'from_c',
      type: { qualType: 'int (void)' },
      isThisDeclarationADefinition: true,
      inner: []
    }]
  }
});

const sidecar = await createClangSemanticImportSidecar({
  sourcePath: 'src/todo.c',
  sourceText: "int from_c(void) { return 0; }\n",
  ast: {
    kind: 'TranslationUnitDecl',
    inner: [{
      kind: 'FunctionDecl',
      name: 'from_c',
      type: { qualType: 'int (void)' },
      isThisDeclarationADefinition: true,
      inner: []
    }]
  }
});

console.log(imported.metadata.astFormat);
console.log(sidecar.symbols.map((symbol) => symbol.name));
```

Defaults to `c`; pass `language: "cpp"` for C++ ASTs when the AST was produced by Clang in C++ mode.

To let the package call a parser function, pass it through `importerOptions`:

```js
const importedFromParser = await importClangSource({
  sourcePath: 'src/todo.cpp',
  sourceText: "int from_cpp() { return 1; }\n",
  language: 'cpp',
  importerOptions: {
    parserOptions: { compileCommandsPath: 'compile_commands.json' },
    parse(sourceText, parserOptions) {
      return parseClangJsonAst(sourceText, parserOptions);
    }
  }
});

console.log(importedFromParser.semanticIndex.symbols.length);
```

This package expects a caller-owned parser AST, parser module, or parser function. It records exact-parser-AST metadata and semantic sidecars for merge review; it does not claim full type, build-system, macro, generator, or runtime semantics unless those are provided as evidence.

## API

- `createClangNativeImporterAdapter(options)`: create the package-level native importer adapter.
- `importClangSource(input, options)`: import source plus a native AST into a Frontier native import result.
- `createClangSemanticImportSidecar(input, options)`: import source and return a semantic import sidecar suitable for swarm merge evidence.
- `ClangLanguagePackage`: package metadata for release-train and coordinator tooling.

## Benchmarks

Run the package-local benchmark with:

```sh
npm run bench
```

These measurements exercise only this package's importer wrapper and semantic sidecar helpers.
