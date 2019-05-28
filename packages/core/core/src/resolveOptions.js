// @flow strict-local

import type {
  FilePath,
  InitialParcelOptions,
  ParcelOptions
} from '@parcel/types';

import {getRootDir} from '@parcel/utils';
import loadDotEnv from './loadDotEnv';
import path from 'path';
import TargetResolver from './TargetResolver';
import {resolveConfig} from '@parcel/utils';

// Default cache directory name
const DEFAULT_CACHE_DIR = '.parcel-cache';

export default async function resolveOptions(
  initialOptions: InitialParcelOptions
): Promise<ParcelOptions> {
  let entries: Array<FilePath>;
  if (initialOptions.entries == null || initialOptions.entries === '') {
    entries = [];
  } else if (Array.isArray(initialOptions.entries)) {
    entries = initialOptions.entries;
  } else {
    entries = [initialOptions.entries];
  }

  let rootDir =
    initialOptions.rootDir != null
      ? initialOptions.rootDir
      : getRootDir(entries);

  let targetResolver = new TargetResolver();
  let targets = await targetResolver.resolve(rootDir, initialOptions);

  let projectRoot = path.dirname(
    (await resolveConfig(path.join(process.cwd(), 'index'), [
      'yarn.lock',
      'package-lock.json',
      'pnpm-lock.yaml',
      '.git',
      '.hg'
    ])) || path.join(process.cwd(), 'index')
  );

  // $FlowFixMe
  return {
    env: initialOptions.env ?? (await loadDotEnv(path.join(rootDir, 'index'))),
    ...initialOptions,
    cacheDir:
      initialOptions.cacheDir != null
        ? initialOptions.cacheDir
        : DEFAULT_CACHE_DIR,
    entries,
    rootDir,
    targets,
    scopeHoist:
      initialOptions.scopeHoist ?? initialOptions.mode === 'production',
    logLevel: initialOptions.logLevel ?? 'info',
    projectRoot
  };
}
