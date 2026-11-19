// News image entry for Wednesday 18 November 2026 (Node 22, standard
// library only): the program copies the entry.png beside this file to
// /output/entry.png. The image sums up the day's world news in one poster.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = join(dirname(fileURLToPath(import.meta.url)), 'entry.png');
if (!existsSync(src)) {
  throw new Error('entry.png is missing next to main.ts');
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const dst = join(outDir, 'entry.png');
copyFileSync(src, dst);
if (statSync(dst).size !== statSync(src).size) {
  throw new Error('copied entry.png does not match the source size');
}

// Verify the written output: it must exist, be non-empty, and stay within
// the competition's 1 MiB limit for the entry image.
const MAX_BYTES = 1048576;
if (!existsSync(dst)) {
  console.error(`output missing: ${dst}`);
  process.exit(1);
}
const outSize = statSync(dst).size;
if (outSize === 0) {
  console.error(`output is empty: ${dst}`);
  process.exit(1);
}
if (outSize > MAX_BYTES) {
  console.error(`output too large: ${dst} is ${outSize} bytes (limit ${MAX_BYTES})`);
  process.exit(1);
}
console.log(`wrote ${dst} (${outSize} bytes)`);
