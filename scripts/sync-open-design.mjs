// Refresh an existing personal, local Open Design system from this package.
// Uses the daemon API for identity/authority, metadata and memory; copies the
// portable package into verified local directories. Existing history is retained.
import {readFile,writeFile,mkdir,cp,realpath} from 'node:fs/promises';
import {resolve,dirname,basename,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const option=name=>args[args.indexOf(name)+1];
for(const key of ['--url','--project','--system'])assert.ok(args.includes(key)&&option(key)&&!option(key).startsWith('--'),`Required: ${key}`);
const url=new URL(option('--url'));
assert.ok(url.protocol==='http:'&&['127.0.0.1','localhost','[::1]'].includes(url.hostname),'Use the discovered local daemon URL.');
const projectId=option('--project'),systemId=option('--system');
assert.match(projectId,/^[a-zA-Z0-9-]+$/);assert.match(systemId,/^user:[a-zA-Z0-9-]+$/);
const api=async(path,method='GET',body)=>{
 const response=await fetch(new URL(path,url),{method,headers:{'Content-Type':'application/json',Origin:url.origin},...(body===undefined?{}:{body:JSON.stringify(body)})});
 const result=await response.json();if(!response.ok)throw new Error(`${method} ${path}: ${response.status} ${JSON.stringify(result)}`);return result;
};
const project=await api(`/api/projects/${projectId}`);
const system=await api(`/api/design-systems/${encodeURIComponent(systemId)}`);
assert.equal(project.project.designSystemId,systemId,'Project must already use the selected system.');
assert.equal(project.project.workspaceId,null,'This local-copy workflow supports personal projects only.');
assert.equal(system.canMutate,true,'The daemon must allow managing this system.');
const projectDir=await realpath(project.resolvedDir);
assert.equal(basename(projectDir),projectId);assert.equal(basename(dirname(projectDir)),'projects');
const dataDir=dirname(dirname(projectDir));
const systemDir=await realpath(join(dataDir,'design-systems',systemId.slice(5)));
const metadata=JSON.parse(await readFile(join(systemDir,'metadata.json'),'utf8'));
assert.equal(metadata.projectId,projectId,'Installed system must belong to this project.');
const brandId=project.project.metadata?.brandId;
assert.match(brandId??'',/^[a-zA-Z0-9-]+$/);
const brandDir=await realpath(join(dataDir,'brands',brandId));
const read=path=>readFile(join(root,path),'utf8');
const pkg=JSON.parse(await read('package.json'));
const manifest=JSON.parse(await read('manifest.json'));
const files=JSON.parse(execFileSync('npm',['pack','--dry-run','--json','--ignore-scripts'],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}))[0].files.map(f=>f.path);
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const typeRule='Fraunces for headings; Newsreader for manuscript and editorial reading; Inter for controls, navigation and website product copy. Keep the full fallback stacks from design-system/tokens.css and bundled font files. Never assign Newsreader to UI controls. Press in the linked repository is the sole authority; brand-assets is retired.';
async function verify(){
 for(const dir of [projectDir,systemDir]){
  for(const file of files){
   if(file==='manifest.json')continue;
   assert.equal(digest(await readFile(join(dir,file))),digest(await readFile(join(root,file))),`Out of sync: ${join(dir,file)}`);
  }
  const installed=JSON.parse(await readFile(join(dir,'manifest.json'),'utf8'));
  assert.equal(installed.id,basename(dir)===projectId?systemId:systemId.slice(5));
  assert.equal(installed.sourceVersion,pkg.version);
 }
 const current=await api(`/api/design-systems/${encodeURIComponent(systemId)}`);
 assert.equal(current.body,await read('DESIGN.md'),'The registered design-system brief differs.');
 assert.equal((await api('/api/memory/rule_brand_press_type')).entry.body.trimEnd(),typeRule);
 const currentProject=await api(`/api/projects/${projectId}`);
 assert.equal(currentProject.project.metadata.entryFile,'index.html');
 assert.equal(currentProject.project.metadata.sourceVersion,pkg.version);
 assert.equal(currentProject.project.metadata.sourceAuthority,root);
 assert.deepEqual(currentProject.project.metadata.linkedDirs,[root]);
 return {version:pkg.version,files:files.length,projectId,systemId,verified:true};
}
if(args.includes('--check')){console.log(JSON.stringify(await verify(),null,2));process.exit(0);}
execFileSync(process.execPath,['scripts/check-system.mjs'],{cwd:root,stdio:'inherit'});
const backup=join(root,'.od-backups',new Date().toISOString().replaceAll(':','-'));
await mkdir(backup,{recursive:true});
for(const [name,dir] of [['project',projectDir],['system',systemDir],['brand',brandDir]])await cp(dir,join(backup,name),{recursive:true});
await writeFile(join(backup,'api-project.json'),JSON.stringify(project,null,2));
await writeFile(join(backup,'api-system.json'),JSON.stringify(system,null,2));
const memoryIds=['user_brand_press_visual','rule_brand_press_palette','rule_brand_press_type','rule_brand_press_layout','rule_brand_press_logo','reference_brand_press_voice'];
const memories=[];for(const id of memoryIds)memories.push((await api(`/api/memory/${id}`)).entry);
await writeFile(join(backup,'api-memory.json'),JSON.stringify(memories,null,2));
console.log(`Backup: ${backup}`);
for(const dir of [projectDir,systemDir]){
 for(const file of files){await mkdir(dirname(join(dir,file)),{recursive:true});await cp(join(root,file),join(dir,file));}
 // The importer validates manifest identity against its installed directory.
 await writeFile(join(dir,'manifest.json'),JSON.stringify({...manifest,id:dir===projectDir?systemId:systemId.slice(5),sourceVersion:pkg.version,sourceAuthority:root},null,2)+'\n');
}
// Keep old entry links useful; other previous artifacts and reviews remain history.
await cp(join(root,'index.html'),join(projectDir,'press-reference.html'));
for(const dir of [projectDir,brandDir]){
 await writeFile(join(dir,'guide.md'),await read('DESIGN.md'));
}
await writeFile(join(projectDir,'BRAND.md'),await read('DESIGN.md'));
const brand=JSON.parse((await readFile(join(brandDir,'brand.json'),'utf8')).replace(/(?<![\/\w])(?:Kindling|KINDLING)\b(?!\/)/g,'kindling'));
brand.description='The definitive kindling system, maintained in Press. Original identity, editorial websites and writing applications.';
brand.logo.notes='Always spell kindling in lowercase, including headings, sentence starts and artwork. Use the lowercase outlined wordmark and lockups. Use original artwork from assets/svg. Stacked signature at least 140px wide, emblem at least 32px, flame from 16px. Reversed on dark, mono for single-color production. Press names the system; kindling is the product.';
brand.typography.body.notes='Newsreader is reading/manuscript typography. Inter is UI and scoped website product-copy typography. See DESIGN.md for the complete roles.';
brand.typography.ui={family:'Inter',fallbacks:['-apple-system','BlinkMacSystemFont','Segoe UI','sans-serif'],weights:[400,500,600],notes:'Controls, navigation, labels and website product copy.'};
brand.layout.postureRules=[
 `Authority: Press ${pkg.version} at ${root}. The sibling brand-assets is retired. This system is a downstream copy; bring shared improvements back to Press.`,
 typeRule,
 'Theme: light paper website/docs; light/dark/system application chrome with an always-light Newsreader manuscript.',
 'Layout: 1120px marketing frame (--page-frame), 960px editorial page frame (--page-frame-editorial), 36rem reading measure, 32px default gutter; reflow at narrow widths. Editorial sequences, hairlines and deliberate terracotta; real state colors in application controls.',
 'Identity: original book-and-flame, outlined wordmark and flame assets; preserve geometry, proportions and role-based minimum sizes.',
 'Components: application.css owns operational controls on every surface, including websites. The website .pw-button is a larger marketing CTA in the same family: accent-text fill, 4px radius, Inter label, inset-ring hover and shared disabled tokens. Secondary actions use a sunken fill. Never stack .pw-button and .ka-button. Consumers own persistence, app stores and APIs.',
 'Manuscript: .pw-writing--app and .ka-manuscript-prose match NovelEditor with 17px Newsreader, --leading-relaxed, --measure and always-light prose tokens. Website consumers use fonts-web.css and the canonical WOFF2 assets; do not substitute third-party font builds.',
 'Interaction: canonical 44px target, visible focus and labels, explicit disabled/busy/error states, full-frame product images, wrapping buttons and contrast-preserving hover.',
 'Iconography: website 16px/1px stroke; application default 20px/1.75px stroke. Motion 100/200ms foundation, 160ms application; honor reduced motion.',
 'Use index.html, preview/brand-assets.html and DESIGN.md. Earlier generated system/ previews, enrichment handoffs and review artifacts are historical; they do not override maintained sources.'
];
brand.sourceAuthority={repository:'https://github.com/smith-and-web/press',version:pkg.version,directory:root};
for(const dir of [projectDir,systemDir,brandDir]){
 await writeFile(join(dir,'brand.json'),JSON.stringify(brand,null,2)+'\n');
 await mkdir(join(dir,'logos'),{recursive:true});
 for(const file of files.filter(file=>file.startsWith('assets/svg/')))await cp(join(root,file),join(dir,'logos',basename(file)));
}
await api(`/api/design-systems/${encodeURIComponent(systemId)}`,'PATCH',{title:'Press',category:'Editorial',surface:'web',artifactMode:'agent-managed',body:await read('DESIGN.md'),sourceNotes:`Maintained source: ${root}; Press ${pkg.version}. Legacy brand-assets retired.`});
const bodies={
 user_brand_press_visual:`Press is the definitive kindling system at ${root}. Read DESIGN.md and the canonical tokens. Warm paper, dark ink, restrained terracotta and original book-and-flame artwork. ${typeRule}`,
 rule_brand_press_type:typeRule,
 rule_brand_press_layout:brand.layout.postureRules.join('\n'),
 rule_brand_press_logo:brand.logo.notes,
 rule_brand_press_palette:'Use semantic tokens from Press design-system/tokens.css; never substitute a generated palette. Light paper #F4EFE6, ink #231D18, terracotta accent #B5532E, accent text and primary control fill #9E3D1B (--color-accent-text). Preserve the full dark palette and always-light manuscript. Ember is reserved for the inner flame.',
 reference_brand_press_voice:'Clear, calm and concrete. Use the writer’s language: scene, beat, manuscript, reference, draft. Explain what actions do. No fabricated metrics, testimonials or claims that in-memory examples have saved data.'
};
for(const entry of memories)await api(`/api/memory/${entry.id}`,'PUT',{...entry,body:bodies[entry.id]});
const fresh=await api(`/api/projects/${projectId}`);
await api(`/api/projects/${projectId}`,'PATCH',{metadata:{...fresh.project.metadata,entryFile:'index.html',linkedDirs:[root],sourceVersion:pkg.version,sourceAuthority:root}});
const result=await verify();
await writeFile(join(backup,'verification.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({...result,backup},null,2));
