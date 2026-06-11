/**
 * fix-pt-strings.mjs
 * Scans all .jsx/.tsx/.js/.ts files in client/src and:
 * 1. Replaces literal \uXXXX escape sequences with real UTF-8 chars
 * 2. Fixes single-quoted strings containing apostrophes (d'água etc.)
 *    by converting them to template literals
 * 3. Reports every file changed and count of fixes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', 'client', 'src');

// Unicode escape sequences → real chars
const UNICODE_MAP = {
  '\\u00c9': 'É', '\\u00e9': 'é', '\\u00ea': 'ê', '\\u00e3': 'ã',
  '\\u00e7': 'ç', '\\u00f5': 'õ', '\\u00fa': 'ú', '\\u00f3': 'ó',
  '\\u00e1': 'á', '\\u00ed': 'í', '\\u00e0': 'à', '\\u00e2': 'â',
  '\\u00f4': 'ô', '\\u00fb': 'û', '\\u00c3': 'Ã', '\\u00c7': 'Ç',
  '\\u00d5': 'Õ', '\\u00da': 'Ú', '\\u00d3': 'Ó', '\\u00c1': 'Á',
  '\\u2014': '—', '\\u2013': '–', '\\u2019': '\u2019',
  '\\u201c': '\u201c', '\\u201d': '\u201d', '\\u00a0': '\u00a0',
  '\\u00b0': '°', '\\u00e4': 'ä', '\\u00ef': 'ï', '\\u00fc': 'ü',
  '\\u00f6': 'ö', '\\u00e8': 'è', '\\u00e2': 'â', '\\u00fb': 'û',
};

// Portuguese diacritic detector
const PT_CHARS = /[àáâãäçèéêëíìîïóôõöúùûüÀÁÂÃÄÇÈÉÊËÍÌÎÏÓÔÕÖÚÙÛÜ]/;

// Collect all target files recursively
function collectFiles(dir, exts = ['.jsx', '.tsx', '.js', '.ts']) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full, exts));
    } else if (exts.includes(path.extname(entry.name))) {
      results.push(full);
    }
  }
  return results;
}

/**
 * Fix single-quoted strings that contain an apostrophe AND Portuguese text.
 * Pattern: 'some d'água text' → `some d'água text`
 * We only target string literals that are VALUES in object properties (after ': ').
 */
function fixApostropheStrings(content) {
  let count = 0;
  // Match single-quoted string that contains an apostrophe character inside (') which is NOT a backslash escape
  // Strategy: find 'text' where the text contains an unescaped single quote
  // We use a careful regex: a single-quoted string where the content has ' (not preceded by \)
  const re = /'((?:[^'\\]|\\.)*)'/g;
  const result = content.replace(re, (match, inner) => {
    // Only convert if inner contains an unescaped apostrophe AND has PT chars
    if (inner.includes("'") && PT_CHARS.test(inner)) {
      count++;
      return '`' + inner + '`';
    }
    return match;
  });
  return { content: result, count };
}

/**
 * Fix double-quoted strings containing literal \uXXXX sequences.
 */
function fixUnicodeEscapes(content) {
  let count = 0;
  let result = content;
  for (const [esc, char] of Object.entries(UNICODE_MAP)) {
    // The escape appears literally as backslash + u + 4 hex digits
    const pattern = esc.replace(/\\/g, '\\\\');
    const re = new RegExp(pattern, 'gi');
    const before = result;
    result = result.replace(re, char);
    if (result !== before) count++;
  }
  return { content: result, count };
}

const files = collectFiles(ROOT);
const report = [];
let totalFiles = 0;
let totalFixes = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  let content = original;
  let fileFixes = 0;

  // Step 1: Fix literal unicode escapes
  const unicodeResult = fixUnicodeEscapes(content);
  content = unicodeResult.content;
  fileFixes += unicodeResult.count;

  // Step 2: Fix apostrophe-in-single-quote issues
  const apostropheResult = fixApostropheStrings(content);
  content = apostropheResult.content;
  fileFixes += apostropheResult.count;

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalFiles++;
    totalFixes += fileFixes;
    report.push({ file: path.relative(ROOT, file), fixes: fileFixes });
    console.log(`  FIXED: ${path.relative(ROOT, file)} (${fileFixes} fixes)`);
  }
}

console.log('\n─────────────────────────────────────────────');
console.log(`Files changed: ${totalFiles}`);
console.log(`Total fixes:   ${totalFixes}`);
if (report.length === 0) console.log('No issues found — all strings are clean.');
