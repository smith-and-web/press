import { mount } from 'svelte';
import Preview from './Preview.svelte';
for(const target of document.querySelectorAll<HTMLElement>('[data-press-preview]')) {
  target.textContent='';
  mount(Preview,{target,props:{kind:target.dataset.pressPreview || 'controls'}});
}
