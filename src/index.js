import {
  NativeImportLanguageProfiles,
  createClangAstNativeImporterAdapter,
  createSemanticImportSidecar,
  createUniversalCapabilityMatrix,
  runNativeImporterAdapter
} from '@shapeshift-labs/frontier-lang-compiler';

export const ClangSourceLanguage = 'c';
export const ClangParser = 'clang';
export const ClangParserAstFormat = 'clang-ast-json';
export const ClangSupportedExtensions = Object.freeze(['.c', '.h', '.cc', '.cpp', '.cxx', '.hpp', '.hh']);

export const ClangLanguagePackage = Object.freeze({
  packageName: '@shapeshift-labs/frontier-lang-clang',
  version: '0.1.8',
  sourceLanguage: ClangSourceLanguage,
  parser: ClangParser,
  parserAstFormat: ClangParserAstFormat,
  supportedExtensions: ClangSupportedExtensions,
  compilerPackage: '@shapeshift-labs/frontier-lang-compiler',
  compilerVersion: '0.2.64'
});

export const ClangCapabilityLanguageProfiles = Object.freeze(
  NativeImportLanguageProfiles.filter((profile) => profile.language === 'c' || profile.language === 'cpp')
);

export { createClangAstNativeImporterAdapter } from '@shapeshift-labs/frontier-lang-compiler';

export function createClangNativeImporterAdapter(options = {}) {
  return createClangAstNativeImporterAdapter(options);
}

export function createClangLanguageCapabilityMatrix(options = {}) {
  const languages = options.languages ?? ClangCapabilityLanguageProfiles;
  const adapters = options.adapters ?? [createClangNativeImporterAdapter(options.importerOptions ?? {})];
  return createUniversalCapabilityMatrix({ ...options, languages, adapters });
}

function mergeAdapterOptions(input = {}, options = {}) {
  const adapterOptions = {
    ...(options.adapterOptions ?? {}),
    ...(input.adapterOptions ?? {})
  };
  for (const alias of ['ast', 'nativeAst', 'translationUnit', 'tu']) {
    if (Object.prototype.hasOwnProperty.call(input, alias)) {
      adapterOptions[alias] = input[alias];
    }
  }
  return adapterOptions;
}

function pickSidecarOptions(options = {}) {
  if (options.sidecarOptions) {
    return options.sidecarOptions;
  }
  const picked = {};
  for (const key of ['id', 'generatedAt', 'regionPrefix']) {
    if (Object.prototype.hasOwnProperty.call(options, key)) {
      picked[key] = options[key];
    }
  }
  return picked;
}

export async function importClangSource(input = {}, options = {}) {
  const importerOptions = {
    ...(options.importerOptions ?? {}),
    ...(input.importerOptions ?? {})
  };
  const adapter = input.adapter ?? createClangNativeImporterAdapter(importerOptions);
  return runNativeImporterAdapter(adapter, {
    sourceText: input.sourceText ?? '',
    sourcePath: input.sourcePath,
    sourceHash: input.sourceHash,
    language: input.language ?? options.language ?? ClangSourceLanguage,
    parser: input.parser ?? options.parser ?? ClangParser,
    parserVersion: input.parserVersion ?? options.parserVersion,
    adapterOptions: mergeAdapterOptions(input, options),
    adapterMetadata: {
      packageName: ClangLanguagePackage.packageName,
      ...(options.adapterMetadata ?? {}),
      ...(input.adapterMetadata ?? {})
    },
    evidence: input.evidence,
    metadata: input.metadata
  });
}

export async function createClangSemanticImportSidecar(input = {}, options = {}) {
  const importResult = await importClangSource(input, options);
  return createSemanticImportSidecar(importResult, pickSidecarOptions(options));
}
