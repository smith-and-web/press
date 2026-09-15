// Compile the reference from the public components. Does not render or test it.
import { createRequire } from 'node:module';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const toolchainIndex = process.argv.indexOf('--toolchain');
const toolchain = toolchainIndex >= 0 ? resolve(process.argv[toolchainIndex + 1]) : root;
const require = createRequire(resolve(toolchain, 'package.json'));
const { compile } = require('svelte/compiler');
const { build } = require('esbuild');
// Generate the example registry and copyable source from the live .svelte files.
const exampleManifest = JSON.parse(await readFile(resolve(root, 'reference/application/examples/manifest.json'), 'utf8'));
const exampleImports = [];
const exampleEntries = [];
for (const [index, example] of exampleManifest.entries()) {
  const source = await readFile(resolve(root, `reference/application/examples/${example.name}Example.svelte`), 'utf8');
  const code = source.replaceAll('../../../design-system/svelte', '@kindling/design-system/svelte')
    .replace('<script lang="ts">', `<script lang="ts">\n  import '@kindling/design-system/fonts.css';\n  import '@kindling/design-system/tokens.css';\n  import '@kindling/design-system/application.css';`);
  exampleImports.push(`import Example${index} from './examples/${example.name}Example.svelte';`);
  exampleEntries.push(`{ ...${JSON.stringify({...example, code})}, component: Example${index} }`);
}
await writeFile(resolve(root, 'reference/application/examples.ts'),
  exampleImports.join('\n') + '\nexport const examples = [\n' + exampleEntries.join(',\n') + '\n];\n');
// The writing recipe is copied from the same complete source that runs live.
const recipes = JSON.parse(await readFile(resolve(root,'reference/application/recipes.json'),'utf8'));
const writing = recipes.find(recipe => recipe.id === 'writing');
writing.description = 'Page-like Tiptap prose, full formatting, and persistent Beats/Page editor state.';
writing.components = ['BeatItem','NovelEditor','ProseToolbar','SegmentedControl','Select','Checkbox'];
writing.code = (await readFile(resolve(root,'reference/application/WritingExample.svelte'),'utf8'))
  .replaceAll('../../design-system/svelte','@kindling/design-system/svelte')
  .replace('<script lang="ts">', `<script lang="ts">\n  import '@kindling/design-system/fonts.css';\n  import '@kindling/design-system/tokens.css';\n  import '@kindling/design-system/application.css';`);
await writeFile(resolve(root,'reference/application/recipes.json'),JSON.stringify(recipes,null,2)+'\n');
await writeFile(resolve(root,'reference/application/recipes.ts'),'export const recipes = '+JSON.stringify(recipes,null,2)+';\n');
const result = await build({
  absWorkingDir: root, entryPoints: ['reference/application/main.ts'],
  bundle: true, write: false, format: 'iife', platform: 'browser', target: ['es2022'],
  conditions: ['svelte', 'browser'], nodePaths: [resolve(toolchain,'node_modules')],
  minify: true, legalComments: 'inline', metafile:true,
  banner: { js: '/*! kindling Press Svelte reference. Notices: licenses/SVELTE.txt, licenses/LUCIDE.txt, licenses/EDITOR_DEPENDENCIES.txt. */' },
  plugins: [{ name: 'svelte-source', setup(build) {
    build.onLoad({ filter: /\.svelte$/ }, async ({ path }) => {
      const compiled = compile(await readFile(path, 'utf8'), { filename:path, generate:'client', css:'injected', dev:false });
      for (const warning of compiled.warnings) console.warn(`${path}: ${warning.code}: ${warning.message}`);
      return { contents:compiled.js.code, loader:'js', resolveDir:dirname(path) };
    });
  }}]
});
// Preserve license notices for the editor dependencies actually bundled.
const packages = new Set();
for (const input of Object.keys(result.metafile.inputs)) {
  const match=input.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/);
  if(match) packages.add(match[1]);
}
let notices='Dependencies bundled in the application reference. Generated from local package notices.\n';
for(const name of [...packages].sort()) {
  const folder=resolve(toolchain,'node_modules',name);
  let license;
  for(const filename of ['LICENSE.md','LICENSE','LICENSE.txt','license']) {
    try {license=await readFile(resolve(folder,filename),'utf8');break;} catch(error){if(error.code!=='ENOENT')throw error;}
  }
  if(license)notices+=`\n\n===== ${name} =====\n${license}`;
}
await writeFile(resolve(root,'licenses/EDITOR_DEPENDENCIES.txt'),notices);
await writeFile(resolve(root,'reference/application/catalog.js'),result.outputFiles[0].contents);
console.log('Wrote the local Svelte application reference bundle.');
