<script lang="ts">
  import { NavigationTree } from '../../../design-system/svelte';
  let { scenes, selected, onSelect }: {scenes:{id:string;title:string;status:string}[];selected:string;onSelect:(id:string)=>void} = $props();
  const nodes = $derived([{id:'act-one',label:'Act one',children:scenes.map(scene=>({id:scene.id,label:scene.title,meta:scene.status}))}]);
</script>
<aside class="kit-sidebar">
  <header class="od-field"><p class="kit-eyebrow">Manuscript</p><h2>The letter home</h2><p>Three scenes · Sample project</p></header>
  <NavigationTree label="Manuscript scenes" {nodes} {selected} {onSelect}/>
  <p class="kit-note">Select a scene to continue writing. Each scene keeps its own rich text and undo history while this page is open.</p>
</aside>
