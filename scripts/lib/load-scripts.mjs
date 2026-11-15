import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function loadBrowserScripts(paths, context = vm.createContext({})) {
  context.self = context;
  context.window = context;
  context.URL = URL;
  context.URLSearchParams = URLSearchParams;
  context.console = console;
  for (const rel of paths) {
    const file = path.join(repoRoot, rel);
    if (!fs.existsSync(file)) throw new Error(`${rel}: file not found`);
    vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: rel });
  }
  return context;
}
