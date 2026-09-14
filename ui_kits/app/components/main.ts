import { mount } from 'svelte';
import App from './App.svelte';
const target=document.getElementById('press-kit');
if(target) { target.textContent=''; mount(App,{target}); }
