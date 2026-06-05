import {
  ClangLanguagePackage,
  createClangNativeImporterAdapter,
  importClangSource,
  createClangSemanticImportSidecar
} from '../src/index.js';
import type {
  ClangSourceImportInput,
  ClangSourceImportOptions,
  ClangSemanticImportSidecarOptions
} from '../src/index.js';
import type { NativeImporterAdapter } from '@shapeshift-labs/frontier-lang-compiler';

const adapter: NativeImporterAdapter = createClangNativeImporterAdapter();
const input: ClangSourceImportInput = { sourceText: '', ast: {} };
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
const sidecarOptions: ClangSemanticImportSidecarOptions = { id: 'sidecar', regionPrefix: 'src' };
const packageName: '@shapeshift-labs/frontier-lang-clang' = ClangLanguagePackage.packageName;

void adapter;
void input;
void parserInput;
void options;
void sidecarOptions;
void packageName;
void importClangSource(input, options);
void createClangSemanticImportSidecar(input, sidecarOptions);
