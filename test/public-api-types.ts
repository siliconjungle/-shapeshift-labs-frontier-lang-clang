import {
  ClangLanguagePackage,
  createClangNativeImporterAdapter,
  createClangLanguageCapabilityMatrix,
  importClangSource,
  createClangSemanticImportSidecar
} from '../src/index.js';
import type {
  ClangLanguageCapabilityMatrixOptions,
  ClangSourceImportInput,
  ClangSourceImportOptions,
  ClangSemanticImportSidecarOptions
} from '../src/index.js';
import type { NativeImporterAdapter, UniversalCapabilityMatrix } from '@shapeshift-labs/frontier-lang-compiler';

const adapter: NativeImporterAdapter = createClangNativeImporterAdapter();
const input: ClangSourceImportInput = { sourceText: '', ast: {} };
const capabilityOptions: ClangLanguageCapabilityMatrixOptions = { targets: ['typescript'] };
const parserInput: ClangSourceImportInput = {
  sourceText: '',
  importerOptions: {
    parserOptions: { compileCommandsPath: 'compile_commands.json' },
    parse(sourceText, parserOptions) {
      void sourceText;
      void parserOptions;
      return {};
    }
  }
};
const options: ClangSourceImportOptions = { adapterOptions: {} };
const sidecarOptions: ClangSemanticImportSidecarOptions = {
  id: 'sidecar',
  generatedAt: 1710000000000,
  regionPrefix: 'src',
  sidecarOptions: {
    id: 'nested-sidecar',
    generatedAt: 1710000000001
  }
};
const packageName: '@shapeshift-labs/frontier-lang-clang' = ClangLanguagePackage.packageName;
const capability: UniversalCapabilityMatrix = createClangLanguageCapabilityMatrix(capabilityOptions);

void adapter;
void input;
void capabilityOptions;
void capability;
void parserInput;
void options;
void sidecarOptions;
void packageName;
void importClangSource(input, options);
void createClangSemanticImportSidecar(input, sidecarOptions);
