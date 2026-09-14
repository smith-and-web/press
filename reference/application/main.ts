import { mount } from 'svelte';
import Catalog from './Catalog.svelte';
const target = document.getElementById('application-catalog');
if (target) mount(Catalog, { target });
