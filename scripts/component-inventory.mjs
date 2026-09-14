// Derive the native version-1 fixture inventory while generating source.
// This inventories static HTML/CSS. Runtime Svelte DOM remains in its source examples.
const sorted=values=>[...new Set(values)].sort((a,b)=>a.localeCompare(b));
const comments=css=>css.replace(/\/\*[\s\S]*?\*\//g,'');
const references=source=>sorted([...source.matchAll(/var\(\s*(--[\w-]+)/g)].map(match=>match[1]));
function splitSelectors(source){let depth=0,start=0;const list=[];for(let i=0;i<source.length;i++){if('(['.includes(source[i]))depth++;if(')]'.includes(source[i]))depth--;if(source[i]===','&&depth===0){list.push(source.slice(start,i));start=i+1;}}list.push(source.slice(start));return list.map(x=>x.trim().replace(/\s+/g,' ')).filter(Boolean);}
export function componentInventory(html,tokensCss){
 const styles=[...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(m=>m[1]);
 const css=comments(styles.join('\n')).replace(/@(media|supports|container|layer)\b[^{]*\{/gi,'{');
 const rules=[...css.matchAll(/(?:^|[{}])\s*([^@{}][^{}]*?)\s*\{([^{}]*)\}/g)].flatMap(m=>splitSelectors(m[1]).filter(s=>!s.includes(':root')&&!/^(from|to|[\d.]+%)$/.test(s)).map(selector=>({selector,tokens:references(m[2])})));
 const selectors=sorted(rules.map(r=>r.selector));
 const classes=sorted([...html.matchAll(/\bclass\s*=\s*(["'])(.*?)\1/gs)].flatMap(m=>m[2].split(/\s+/)).filter(Boolean));
 const elements=sorted([...html.matchAll(/<\s*([a-z][a-z0-9-]*)\b/gi)].map(m=>m[1].toLowerCase()));
 const declared=sorted([...comments(tokensCss).matchAll(/(--[\w-]+)\s*:/g)].map(m=>m[1]));
 const referenced=references(html);
 const definitions=[
 ['buttons','Buttons and calls to action',/button|\.btn\b|cta/i,/button|^btn|cta/i,/^button$/],
 ['inputs','Form fields and controls',/input|textarea|select|\.field|label/i,/field|input|control|form/i,/^(input|textarea|select|label|form)$/],
 ['cards','Cards and panels',/card|panel|tile/i,/card|panel|tile/i,/^$/],
 ['badges','Badges, chips, and status labels',/badge|chip|tag|pill/i,/badge|chip|tag|pill|status/i,/^$/],
 ['links','Links and inline actions',/(^|\s)a\b|\.link/i,/link/i,/^a$/],
 ['keyboard','Keyboard hints',/kbd|keyboard|shortcut/i,/kbd|keyboard|shortcut/i,/^kbd$/],
 ['icons','Icon slots',/icon|aria-hidden/i,/icon/i,/^svg$/],
 ['typography','Typography scale and text utilities',/h[1-6]|lead|eyebrow|caption/i,/lead|eyebrow|caption/i,/^(h[1-6]|p)$/],
 ['layout','Layout primitives',/container|stack|row|section|main|nav|grid/i,/container|stack|row|grid|layout/i,/^(main|section|nav|header|footer)$/]
 ];
 const groups=definitions.map(([id,label,selectorRE,classRE,elementRE])=>{const matchedSelectors=selectors.filter(s=>selectorRE.test(s));const matchedClasses=classes.filter(s=>classRE.test(s));const matchedElements=elements.filter(s=>elementRE.test(s));return{id,label,present:!!(matchedSelectors.length+matchedClasses.length+matchedElements.length),selectors:matchedSelectors,classes:matchedClasses,elements:matchedElements,tokenReferences:sorted(rules.filter(r=>matchedSelectors.includes(r.selector)).flatMap(r=>r.tokens)).filter(t=>referenced.includes(t))};});
 const literalCss=css.replace(/:root(?:\[[^\]]+\])?\s*\{[\s\S]*?\}/g,'');
 return{schemaVersion:1,brandId:'press',source:{componentsHtml:'components.html',tokensCss:'tokens.css'},fixture:{title:html.match(/<title>(.*?)<\/title>/)?.[1]||'Press components',description:'Static fixture inventory; working Svelte examples are linked from components.html.',styleBlockCount:styles.length,selectorCount:selectors.length,classCount:classes.length,elementCount:elements.length},tokens:{declared,referenced,unusedDeclared:declared.filter(t=>!referenced.includes(t)),undeclaredReferenced:referenced.filter(t=>!declared.includes(t))},selectors,classes,elements,groups,literals:{colorExpressions:[...literalCss.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|oklch\([^)]*\)|color-mix\([^)]*\)/gi)].length,pixelValues:[...literalCss.matchAll(/(?<![\w-])-?\d*\.?\d+px\b/g)].length,hardcodedFontFamilies:[...literalCss.matchAll(/\bfont-family\s*:\s*(?!var\()/gi)].length}};
}
