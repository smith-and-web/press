#!/usr/bin/env node
/* Regenerate only the website catalog from its editable specimen source.
   The first run also installs the 0.2.0 catalog structure into the 0.1.0 reference. */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const here = new URL('.', import.meta.url);
const root = new URL('../', here);
const read = name => readFile(new URL(name, root), 'utf8');
const data = JSON.parse(await read('reference/website-snippets.json'));
const pkg = JSON.parse(await read('package.json'));
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const start = '<!-- WEBSITE-CATALOG:START -->';
const end = '<!-- WEBSITE-CATALOG:END -->';
const toc = data.items.map((item,i) => `<a href="#${escape(item.id)}"><span class="catalog-num">${String(i+1).padStart(2,'0')}</span><span>${escape(item.title)}</span></a>`).join('\n');
// Embed only the live feature reference images; copied markup stays portable.
const liveMarkup = new Map();
for (const item of data.items) {
  let markup = item.markup;
  if (item.id === 'web-features') {
    for (const match of [...markup.matchAll(/src="(assets\/website\/[a-z0-9-]+\.png)"/g)]) {
      const bytes = await readFile(new URL(match[1], root));
      markup = markup.replace(match[0], `src="data:image/png;base64,${bytes.toString('base64')}"`);
    }
  }
  liveMarkup.set(item.id, markup);
}
const examples = data.items.map((item,i) => `
<article class="website-specimen" id="${escape(item.id)}" aria-labelledby="${escape(item.id)}-title">
  <header class="specimen-heading"><span class="catalog-num">${String(i+1).padStart(2,'0')}</span><div><h3 id="${escape(item.id)}-title">${escape(item.title)}</h3><p>${escape(item.description)}</p></div></header>
  <div class="specimen-surface">${liveMarkup.get(item.id)}</div>
  <p class="specimen-source"><span>Source: ${escape(item.source)}</span><code>${escape(item.css)}</code></p>
  <details class="specimen-code"><summary>Markup &amp; usage</summary>
    <div class="specimen-usage"><p>${escape(item.usage)}</p><p>Load fonts, tokens and the opt-in website stylesheet. Interactive patterns also use website.js. Update sample destinations and give every copied instance unique IDs and radio-group names.</p></div>
    <div class="code-block"><pre tabindex="0" aria-label="${escape(item.title)} markup"><code id="${escape(item.id)}-code">${escape(item.markup)}</code></pre><div class="code-footer"><span>HTML / ${escape(item.title)}</span><button class="small-button" type="button" data-copy-target="${escape(item.id)}-code">Copy markup</button></div></div>
  </details>
</article>`).join('\n');
const catalog = `${start}
<div id="components" aria-hidden="true"></div>
<section class="guide-section" id="website-components" aria-labelledby="website-heading">
  <div class="catalog-lead"><header class="section-heading"><span class="folio">05</span><h2 id="website-heading">Website components.</h2></header><span class="release">v${escape(pkg.version)}</span></div>
  <p class="section-intro">The pieces that carry Press onto the web. Drawn from Kindling’s website and editorial redesign, ready to compose into your next page.</p>
  <div class="catalog-meta"><span>${data.items.length} patterns</span><span>Opt-in CSS + JavaScript</span><span>Light Press surfaces</span></div>
  <nav class="catalog-toc" aria-label="Website component index">${toc}</nav>
  <p class="note">Website copy uses Inter; manuscript prose stays Newsreader. These examples keep their light palette when the surrounding reference switches to dark. <a href="docs/WEBSITE_COMPONENTS.md">Read the website component guide</a>.</p>
  ${examples}
  <p class="note website-endnote">Ready to integrate? Start with <a href="docs/WEBSITE_COMPONENTS.md">the website API guide</a>, then adopt one pattern at a time. <a href="#application-components">Continue to Application components</a>.</p>
</section>
${end}`;
let html = await read('index.html');
if (html.includes(start) && html.includes(end)) {
  html = html.slice(0,html.indexOf(start)) + catalog + html.slice(html.indexOf(end)+end.length);
} else {
  const anchor = '<section class="guide-section" id="components" aria-labelledby="component-heading">';
  if (!html.includes(anchor)) throw new Error('Cannot locate the baseline component section; preserve index.html and supply catalog markers explicitly.');
  html = html.replace(anchor, catalog+'\n<section class="guide-section" id="application-components" aria-labelledby="component-heading">');
  html = html.replace('<span class="folio">05</span><h2 id="component-heading">Familiar pieces. Considered details.</h2>', '<span class="folio">06</span><h2 id="component-heading">Application components.</h2>');
  html = html.replace('Shared styles provide the foundation. Labels, focus, feedback, and behavior make the pieces work.', 'The existing application foundation: controls, manuscript prose, and feedback. These examples stay available while the website catalog grows.');
  html = html.replace('aria-label="Component specimens"','aria-label="Application component specimens"');
  html = html.replace('<span class="folio">06</span><h2 id="assets-heading">','<span class="folio">07</span><h2 id="assets-heading">');
  html = html.replace('<span class="folio">07</span><h2 id="integration-heading">','<span class="folio">08</span><h2 id="integration-heading">');
  const navigation = [
    ['overview','01','Overview'],['typography','02','Typography'],['color','03','Color'],['spacing','04','Spacing'],
    ['website-components','05','Website'],['application-components','06','Application'],['assets','07','Brand assets'],['integration','08','Integration']
  ].map(([id,num,label],i) => (i===4?'<p class="nav-group-label">Components</p>':i===6?'<p class="nav-group-label">Resources</p>':'')+`<a href="#${id}"${i===0?' aria-current="location"':''}><span class="nav-num">${num}</span><span>${label}</span></a>`).join('');
  html = html.replace(/<nav class="section-nav" aria-label="Sections">[\s\S]*?<\/nav>/,`<nav class="section-nav" aria-label="Sections">${navigation}</nav>`);
  const shortcuts = '<div class="catalog-shortcuts"><p>Explore the component library</p><div class="catalog-actions"><a href="#website-components">Website components →</a><a href="#application-components">Application components →</a></div></div>';
  html = html.replace('</section>\n<section class="guide-section" id="typography"',shortcuts+'\n</section>\n<section class="guide-section" id="typography"');
  html = html.replace('<link rel="stylesheet" href="reference/reference.css">','<link rel="stylesheet" href="reference/reference.css">\n<link rel="stylesheet" href="design-system/website.css">\n<link rel="stylesheet" href="reference/website-catalog.css">');
  html = html.replace('<script src="reference/reference.js" defer></script>','<script src="reference/reference.js" defer></script>\n<script src="design-system/website.js" defer></script>');
  html = html.replace('<div class="doc-links">','<div class="doc-links"><a href="docs/WEBSITE_COMPONENTS.md">Website component APIs →</a>');
  html = html.replaceAll('0.1.0',pkg.version);
}
html = html.replace(/<span class="release">v[^<]*<\/span>/,`<span class="release">v${escape(pkg.version)}</span>`);
await writeFile(new URL('index.html',root),html);
console.log(`Wrote ${fileURLToPath(new URL('index.html',root))} with ${data.items.length} website specimens.`);
