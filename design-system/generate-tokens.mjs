#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cssPath = resolve(here, "tokens.css");
const jsonPath = resolve(here, "tokens.json");
const referencePath = resolve(here, "../reference/tokens.js");
const checkOnly = process.argv.includes("--check");

function declarations(block) {
  const values = new Map();
  const declaration = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  for (const match of block.matchAll(declaration)) {
    values.set(`--${match[1]}`, match[2].trim());
  }
  return values;
}

function blockFor(css, selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Missing ${selector} block in tokens.css`);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") depth -= 1;
    if (depth === 0) return css.slice(open + 1, index);
  }
  throw new Error(`Unclosed ${selector} block in tokens.css`);
}

function resolveAll(values) {
  const resolved = new Map();

  function resolveToken(name, stack = []) {
    if (resolved.has(name)) return resolved.get(name);
    if (stack.includes(name)) throw new Error(`Circular token reference: ${[...stack, name].join(" -> ")}`);
    const value = values.get(name);
    if (value === undefined) throw new Error(`Unknown token reference: ${name}`);
    const result = value.replace(/var\((--[a-z0-9-]+)\)/gi, (_, dependency) =>
      resolveToken(dependency, [...stack, name])
    );
    resolved.set(name, result);
    return result;
  }

  return Object.fromEntries([...values.keys()].map((name) => [name, resolveToken(name)]));
}

function render(css) {
  const light = declarations(blockFor(css, ":root"));
  const darkOverrides = declarations(blockFor(css, '[data-theme="dark"]'));
  if (light.size === 0) throw new Error("No tokens found in :root");

  const dark = new Map(light);
  for (const [name, value] of darkOverrides) dark.set(name, value);

  return `${JSON.stringify(
    {
      $name: "Kindling — Press design tokens",
      $source: "tokens.css (generated; do not edit)",
      light: resolveAll(light),
      dark: resolveAll(dark),
    },
    null,
    2
  )}\n`;
}

const css = await readFile(cssPath, "utf8");
const expected = render(css);
const expectedReference = `/* Generated from tokens.css; do not edit. */\nwindow.KindlingTokens = ${expected.trim()};\n`;

if (checkOnly) {
  const actual = await readFile(jsonPath, "utf8").catch(() => "");
  const actualReference = await readFile(referencePath, "utf8").catch(() => "");
  if (actual !== expected || actualReference !== expectedReference) {
    console.error("tokens.json or reference/tokens.js is stale; run: node design-system/generate-tokens.mjs");
    process.exitCode = 1;
  } else {
    console.log("tokens.json and reference/tokens.js agree with tokens.css");
  }
} else {
  await writeFile(jsonPath, expected);
  await writeFile(referencePath, expectedReference);
  console.log("generated tokens.json and reference/tokens.js from tokens.css");
}
