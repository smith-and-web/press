<script lang="ts">
  import { Button } from '../../../design-system/svelte';
  import Sidebar from './Sidebar.svelte';
  import SceneEditor from './SceneEditor.svelte';
  let theme=$state('light');
  let selected=$state('harbor');
  let scenes=$state([
    {id:'harbor',title:'Arrival at the harbor',status:'Draft',type:'Normal',content:'<p>Mara reached the harbor. The lantern shone over the water.</p><p>She turned the letter over in her hands. <em>Come home</em>, it said. Nothing else.</p><p>Beyond the quay, the town had begun to wake. She folded the paper along its familiar crease and walked toward the hill.</p>'},
    {id:'letter',title:'The letter',status:'Revised',type:'Flashback',content:'<p>The letter had arrived on a Thursday, tucked beneath the morning paper.</p><p>At first she had mistaken the handwriting for her own. Then she saw the way the last word leaned into the margin.</p><blockquote><p>There is still a room for you here.</p></blockquote><p>She read the sentence twice.</p>'},
    {id:'home',title:'A light upstairs',status:'Draft',type:'Normal',content:'<p>She carried the letter home.</p><p>At the door, she paused. A light was still burning in the upstairs window.</p><p>For a moment, all she could hear was the sea.</p>'}
  ]);
</script>
<div class="press-app kit" data-theme={theme}>
  <header class="kit-topbar od-row">
    <a class="kit-brand" href="../../index.html">Kindling <span>/ Press</span></a>
    <p class="od-fill">Writing workspace</p>
    <Button variant="secondary" onclick={()=>theme=theme==='light'?'dark':'light'}>Use {theme==='light'?'dark':'light'} theme</Button>
  </header>
  <div class="kit-layout">
    <Sidebar {scenes} {selected} onSelect={(id)=>selected=id}/>
    <main class="kit-workspace">
      <p class="kit-local-note">Sample project · Edits stay in this page and are discarded on reload.</p>
      {#each scenes as scene (scene.id)}
        <!-- Preserve mounted editor instances and their independent undo stacks. -->
        <div hidden={selected!==scene.id}>
          <SceneEditor {scene} onContent={(html)=>scene.content=html} onStatus={(status)=>scene.status=status} onType={(type)=>scene.type=type}/>
        </div>
      {/each}
    </main>
  </div>
</div>
