/* Reference interactions only; no network or consumer integration. */
'use strict';
const tokenData = window.KindlingTokens;
const root = document.documentElement;
const themeButtons = [...document.querySelectorAll('[data-set-theme]')];
let activeTheme = 'light';
let tokenPage = 0;
const pageSize = 12;
const tokenSearch = document.querySelector('#token-search');
const tokenGroup = document.querySelector('#token-group');
const tokenRows = document.querySelector('#token-rows');
function applyTheme(theme) {
  activeTheme = theme === 'dark' ? 'dark' : 'light';
  root.dataset.theme = activeTheme;
  root.style.colorScheme = activeTheme;
  themeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.setTheme === activeTheme)));
  document.querySelectorAll('[data-theme-image]').forEach(img => { img.src = img.dataset[activeTheme]; });
  document.querySelectorAll('[data-theme-download]').forEach(link => { link.href = link.dataset[activeTheme]; });
  document.querySelectorAll('[data-swatch-token]').forEach(button => {
    const key = button.dataset.swatchToken;
    button.querySelector('.swatch-value').textContent = tokenData[activeTheme][key];
    button.setAttribute('aria-label', 'Copy '+key+' '+tokenData[activeTheme][key]);
  });
  try { localStorage.setItem('kindling-reference-theme', activeTheme); } catch (_) {}
  if (tokenRows) renderTokens();
}
themeButtons.forEach(button => button.addEventListener('click', () => applyTheme(button.dataset.setTheme)));
const copyDialog = document.querySelector('#copy-dialog');
async function copyText(value, button) {
  const previous = button.innerHTML;
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Manual copy');
    await navigator.clipboard.writeText(value);
    if (button.matches('.swatch')) {
      document.querySelector('#palette-feedback').textContent = 'Copied '+button.dataset.swatchToken;
    } else {
      button.textContent = 'Copied';
      setTimeout(() => { button.innerHTML = previous; }, 1800);
    }
    document.querySelector('#announcer').textContent = 'Copied to clipboard.';
  } catch (_) {
    document.querySelector('#manual-copy').value = value;
    copyDialog.showModal();
    document.querySelector('#manual-copy').focus();
    document.querySelector('#manual-copy').select();
  }
}
document.querySelectorAll('[data-copy-target]').forEach(button => button.addEventListener('click', () => {
  copyText(document.getElementById(button.dataset.copyTarget).textContent.trim(), button);
}));
document.querySelectorAll('[data-swatch-token]').forEach(button => button.addEventListener('click', () => {
  const token = button.dataset.swatchToken;
  copyText('var('+token+')',button);
}));
function filteredTokens() {
  const term = tokenSearch.value.trim().toLowerCase();
  const group = tokenGroup.value;
  return Object.entries(tokenData[activeTheme]).filter(([name,value]) => {
    const matchGroup = group === 'all' || (group === 'type' ? /^--(font|text|leading|tracking)/.test(name) : name.startsWith('--'+group));
    return matchGroup && (name.toLowerCase().includes(term) || value.toLowerCase().includes(term));
  });
}
function renderTokens() {
  const all = filteredTokens();
  const pages = Math.max(1, Math.ceil(all.length/pageSize));
  tokenPage = Math.min(tokenPage,pages-1);
  tokenRows.replaceChildren();
  for (const [name,value] of all.slice(tokenPage*pageSize,(tokenPage+1)*pageSize)) {
    const row = document.createElement('tr');
    const key = document.createElement('td'); key.textContent = name;
    const val = document.createElement('td');
    if (value.length > 100) {
      const details = document.createElement('details');
      const summary = document.createElement('summary'); summary.textContent = 'Expand full value';
      const body = document.createElement('p'); body.textContent = value;
      details.append(summary,body); val.append(details);
    } else val.textContent = value;
    const action = document.createElement('td');
    const button = document.createElement('button'); button.type = 'button'; button.className = 'small-button'; button.textContent = 'Copy';
    button.setAttribute('aria-label','Copy declaration for '+name);
    button.addEventListener('click',() => copyText(name+': '+value+';',button));
    action.append(button); row.append(key,val,action); tokenRows.append(row);
  }
  const start = all.length ? tokenPage*pageSize+1 : 0;
  const end = Math.min(all.length,(tokenPage+1)*pageSize);
  document.querySelector('#token-count').textContent = all.length ? `${start}–${end} of ${all.length} tokens · ${activeTheme}` : 'No matching tokens. Try another name or clear the filter.';
  document.querySelector('#token-prev').disabled = tokenPage===0;
  document.querySelector('#token-next').disabled = tokenPage>=pages-1;
}
[tokenSearch,tokenGroup].forEach(control => control.addEventListener('input',() => {tokenPage=0;renderTokens();}));
document.querySelector('#token-prev').addEventListener('click',() => {tokenPage--;renderTokens();});
document.querySelector('#token-next').addEventListener('click',() => {tokenPage++;renderTokens();});
const tabs = [...document.querySelectorAll('#application-components .component-tabs [role="tab"]')];
function setTab(tab) {
  tabs.forEach(item => {
    const selected = item===tab;
    item.setAttribute('aria-selected',String(selected)); item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}
tabs.forEach((tab,index) => {
  tab.addEventListener('click',() => setTab(tab));
  tab.addEventListener('keydown',event => {
    let next;
    if (event.key==='ArrowRight') next=(index+1)%tabs.length;
    if (event.key==='ArrowLeft') next=(index-1+tabs.length)%tabs.length;
    if (event.key==='Home') next=0;
    if (event.key==='End') next=tabs.length-1;
    if (next!==undefined) {event.preventDefault();setTab(tabs[next]);tabs[next].focus();}
  });
});
const titleInput = document.querySelector('#chapter-title');
const titleError = document.querySelector('#title-error');
function validateTitle() {
  const empty = !titleInput.value.trim();
  titleInput.setAttribute('aria-invalid',String(empty));
  titleError.hidden = !empty;
  return !empty;
}
titleInput.addEventListener('blur',validateTitle);
document.querySelector('#title-form').addEventListener('submit',event => {
  event.preventDefault();
  const result = document.querySelector('#form-result');
  result.textContent = '';
  if (!validateTitle()) {titleInput.focus();return;}
  const button = document.querySelector('#save-title');
  const value = titleInput.value.trim();
  button.disabled = true;button.textContent='Saving…';
  titleInput.readOnly=true;
  setTimeout(() => {
    let stored = false;
    try {localStorage.setItem('kindling-reference-chapter',value);stored=true;} catch (_) {}
    document.querySelector('#saved-title').textContent=value;
    result.textContent=stored ? 'Saved in this browser. Your title is in the Prose specimen.' : 'Saved for this session. Browser storage is unavailable.';
    button.disabled=false;button.textContent='Save title';titleInput.readOnly=false;
  },450);
});
const sampleDialog = document.querySelector('#sample-dialog');
document.querySelector('#open-dialog').addEventListener('click',() => sampleDialog.showModal());
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click',() => button.closest('dialog').close()));
const links=[...document.querySelectorAll('.section-nav a')];
function markActive(id) { links.forEach(link => { if(link.hash==='#'+id) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); }); }
links.forEach(link => link.addEventListener('click',() => markActive(link.hash.slice(1))));
if ('IntersectionObserver' in window) {
  const observer=new IntersectionObserver(entries => {
    entries.filter(entry=>entry.isIntersecting).forEach(entry=>markActive(entry.target.id));
  },{rootMargin:'-8% 0px -65% 0px',threshold:0});
  document.querySelectorAll('main > section[id]').forEach(section=>observer.observe(section));
}
try {
  const saved = localStorage.getItem('kindling-reference-chapter');
  if (saved) {titleInput.value=saved;document.querySelector('#saved-title').textContent=saved;}
  activeTheme=localStorage.getItem('kindling-reference-theme')==='dark'?'dark':'light';
} catch (_) {}
applyTheme(activeTheme);
