import type {
  ClangAstNativeImporterAdapterOptions,
  NativeImporterAdapter,
  NativeImporterAdapterImportResult,
  SemanticImportSidecar,
  SemanticImportSidecarOptions
} from '@shapeshift-labs/frontier-lang-compiler';

export declare const ClangSourceLanguage: 'c';
export declare const ClangParser: 'clang';
export declare const ClangParserAstFormat: 'clang-ast-json';
export declare const ClangSupportedExtensions: readonly string[];

export interface ClangLanguagePackageMetadata {
  readonly packageName: '@shapeshift-labs/frontier-lang-clang';
  readonly version: '0.1.0';
  readonly sourceLanguage: 'c';
  readonly parser: 'clang';
  readonly parserAstFormat: 'clang-ast-json';
  readonly supportedExtensions: readonly string[];
  readonly compilerPackage: '@shapeshift-labs/frontier-lang-compiler';
  readonly compilerVersion: '0.2.31';
}

export declare const ClangLanguagePackage: ClangLanguagePackageMetadata;

export { createClangAstNativeImporterAdapter } from '@shapeshift-labs/frontier-lang-compiler';

export interface ClangSourceImportInput {
  readonly sourceText?: string;
  readonly sourcePath?: string;
  readonly sourceHash?: string;
  readonly language?: string;
  readonly parser?: string;
  readonly parserVersion?: string;
  readonly adapter?: NativeImporterAdapter;
  readonly importerOptions?: ClangAstNativeImporterAdapterOptions;
  readonly adapterOptions?: Record<string, unknown>;
  readonly adapterMetadata?: Record<string, unknown>;
  readonly evidence?: readonly unknown[];
  readonly metadata?: Record<string, unknown>;
  readonly ast?: unknown;
  readonly nativeAst?: unknown;
  readonly translationUnit?: unknown;
  readonly tu?: unknown;
}

export interface ClangSourceImportOptions {
  readonly language?: string;
  readonly parser?: string;
  readonly parserVersion?: string;
  readonly importerOptions?: ClangAstNativeImporterAdapterOptions;
  readonly adapterOptions?: Record<string, unknown>;
  readonly adapterMetadata?: Record<string, unknown>;
}

export interface ClangSemanticImportSidecarOptions extends ClangSourceImportOptions {
  readonly sidecarOptions?: SemanticImportSidecarOptions;
  readonly id?: string;
  readonly generatedAt?: string;
  readonly regionPrefix?: string;
}

export declare function createClangNativeImporterAdapter(options?: ClangAstNativeImporterAdapterOptions): NativeImporterAdapter;
export declare function importClangSource(input?: ClangSourceImportInput, options?: ClangSourceImportOptions): Promise<NativeImporterAdapterImportResult>;
export declare function createClangSemanticImportSidecar(input?: ClangSourceImportInput, options?: ClangSemanticImportSidecarOptions): Promise<SemanticImportSidecar>;
