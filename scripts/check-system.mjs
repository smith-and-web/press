// Verify the contracts that previously drifted between Press and its copies.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFile(resolve(root,path),'utf8');
execFileSync(process.execPath,['design-system/generate-tokens.mjs','--check'],{cwd:root,stdio:'inherit'});
/* Published web fonts must still match the canonical TTFs they were encoded
   from. Skipped when the encoder is absent so a consumer checkout without
   devDependencies can still run the rest. */
try{await import('subset-font');execFileSync(process.execPath,['scripts/build-web-fonts.mjs','--check'],{cwd:root,stdio:'inherit'});}
catch(error){if(error?.code!=='ERR_MODULE_NOT_FOUND')throw error;console.log('subset-font absent; skipped web font check.');}
const canonical=await read('design-system/tokens.css');
assert.equal(await read('tokens.css'),'/* Generated from design-system/tokens.css by open-design:build. */\n'+canonical,'Root tokens are stale; run open-design:build.');
const fonts=(await read('design-system/fonts.css')).replaceAll('../assets/','assets/');
assert.equal(await read('colors_and_type.css'),'/* Generated from canonical tokens and local font declarations. Do not hand-edit. */\n'+fonts+'\n'+canonical,'Open Design font/token entry is stale.');
assert.match(await read('assets/build_assets.py'), /WM_TEXT = "kindling"/, 'The outlined wordmark must use lowercase kindling.');
const manifest=JSON.parse(await read('manifest.json'));
const pkg=JSON.parse(await read('package.json'));
for(const path of [...Object.values(manifest.files),manifest.usage,manifest.componentsManifest,...manifest.fonts.map(f=>f.file),...manifest.preview.pages.map(p=>p.path)])await readFile(resolve(root,path));
for(const page of manifest.preview.pages)assert.ok((await read(page.path)).includes(`kindling / Press · ${pkg.version}`),`Stale version in ${page.path}`);
assert.ok((await read('index.html')).includes(`<span class="release">v${pkg.version}</span>`),'Catalog version is stale.');
const originals=JSON.parse(await read('docs/CONSOLIDATION_ASSETS.json'));
for(const asset of originals.files){
 const hash=createHash('sha256').update(await readFile(resolve(root,asset.path))).digest('hex');
 assert.equal(hash,asset.sha256,`Production artwork changed: ${asset.path}. Review and record an intentional replacement.`);
}
assert.ok((await read('design-system/website.css')).includes('--pw-touch: var(--control-target)'),'Website target must use the canonical token.');
assert.ok((await read('design-system/application.css')).includes('--ka-touch:var(--control-target)'),'Application target must use the canonical token.');
/* One implementation per control role. The website layer styles the marketing
   CTA only; operational controls come from application.css. The two must stay
   the same family — same fill, radius and hover — or a visitor crossing from
   the site into the app meets two button systems. */
const web=await read('design-system/website.css'),app=await read('design-system/application.css');
assert.match(web,/\.press-web \.pw-button \{[^}]*background: var\(--color-accent-text\)/,'The marketing CTA must share .ka-button\'s accent-text fill.');
assert.match(app,/\.ka-button\{[^}]*background:var\(--color-accent-text\)/,'.ka-button fill changed; re-check the website CTA.');
assert.match(web,/\.press-web \.pw-button:hover:not\(:disabled\) \{ box-shadow: inset 0 0 0 1px currentColor; \}/,'The CTA hover must be .ka-button\'s inset ring.');
assert.ok(web.includes('--pw-radius: var(--radius-xs)')&&app.includes('--ka-radius-small:4px')&&canonical.includes('--radius-xs:4px'),'CTA and application control radii must resolve to the same 4px.');
/* The manuscript reference must match the editor it depicts: 17px Newsreader
   at --leading-relaxed, held to --measure (src/lib/components/NovelEditor.svelte). */
for(const [file,source] of [['application.css',app],['website.css',web]])
 assert.ok(/var\(--text-body\)\/?\s*var\(--leading-relaxed\)|font-size: var\(--text-body\); line-height: var\(--leading-relaxed\)/.test(source),`Manuscript prose role missing from ${file}.`);
/* An application surface nested in a website surface keeps application type
   (0.13.0). Through 0.12.0 `.press-web h3` tied `.press-app h3` at (0,1,1)
   and won on load order, halving an embedded manuscript heading. The guard
   must stay inside `:where()`, or every website default gains specificity
   and consumer overrides silently stop winning. */
for(const rule of [':where(h1,h2,h3,h4)',':where(h1,h2)','h3','h4','p'])
 assert.ok(web.includes(`.press-web ${rule}:where(:not(.press-web .press-app *))`),`.press-web ${rule} must stop at a nested .press-app.`);
assert.ok(!/\.press-web (?:h[1-4]|p) \{/.test(web),'An unguarded .press-web element default would reach a nested .press-app.');
/* A manuscript seated in a beat reads at the editor's size, not the beat
   note's --text-body-lg. */
assert.ok(app.includes('.ka-beat-body p:where(:not(.ka-manuscript *))'),'.ka-beat-body p must exclude a nested manuscript.');
/* The workspace grid is a child of the container: a container query cannot
   restyle its own container, so the narrow layout depends on the split. */
assert.ok(app.includes('container:ka-workspace/inline-size')&&app.includes('@container ka-workspace'),'The workspace must be its own query container.');
assert.ok(!/@container ka-workspace[^{]*\{[^@]*\.ka-workspace\{/.test(app),'A ka-workspace container query must not target .ka-workspace itself.');
/* The read-only manuscript indents paragraphs by the editor's own measure
   rather than spacing them (0.13.0); through 0.12.0 it spaced them 16px apart
   while NovelEditor indented, so the reference disagreed with the product. */
const editor=await read('design-system/svelte/editor/NovelEditor.svelte');
const editorIndent=editor.match(/--kp-line-indent:([^;]+);/)?.[1];
assert.ok(editorIndent&&app.includes(`--ka-line-indent:${editorIndent}`),`.ka-manuscript-prose must indent by NovelEditor's --kp-line-indent (${editorIndent}).`);
assert.ok(app.includes('.ka-manuscript-prose p:not(:first-child){text-indent:var(--ka-line-indent)}'),'Manuscript paragraphs must indent, not space — every one but its container\'s first, as the editor does.');
assert.ok(app.includes('.ka-manuscript-prose blockquote{')&&app.includes('var(--color-prose-blockquote-border)'),'The manuscript must draw a blockquote as the editor does.');
/* Only the open beat carries the accent, as in the application. */
assert.ok(app.includes('.ka-beat:not([open]) .ka-beat-number{background:transparent'),'A closed beat number must not be accent-filled.');
/* The workspace's knobs must be settable from an ancestor, so none may be
   declared on .ka-workspace itself (a declaration beats an inherited value). */
assert.ok(!/\.ka-workspace\{[^}]*--ka-workspace-[a-z-]+:/.test(app),'Declare no --ka-workspace-* default on .ka-workspace; use var() fallbacks.');
console.log(`Press ${pkg.version}: generated token entries, ${manifest.preview.pages.length} previews and ${originals.files.length} production assets agree.`);
