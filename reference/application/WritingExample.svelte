<script lang="ts">
  import { BeatItem, SegmentedControl, Select, Checkbox } from '../../design-system/svelte';
  import { NovelEditor } from '../../design-system/svelte/editor';
  const options=(...labels:string[])=>labels.map(label=>({label,value:label}));
  let view=$state('Beats'), sceneType=$state('Normal'), status=$state('Draft'), planning=$state('Fixed');
  let readonly=$state(false), firstOpen=$state(true), secondOpen=$state(false);
  let previousOpen=[true,false];
  let prose=$state('<p>Mara reached the harbor. The lantern shone over the water.</p><p>She turned the letter over in her hands. <em>Come home</em>, it said. Nothing else.</p>');
  let letter=$state('<p>She carried the letter home.</p><p>At the door, she paused. A light was still burning in the upstairs window.</p>');
  function changeView(next:string){
    if(next==='Page'){previousOpen=[firstOpen,secondOpen];firstOpen=true;secondOpen=true;}
    else [firstOpen,secondOpen]=previousOpen;
  }
</script>

<div class="press-app od-stack writing-example" style="--od-gap:24px">
  <div class="writing-metadata">
    <Select label="Scene type" options={options('Normal','Flashback','Flashforward')} bind:value={sceneType}/>
    <Select label="Status" options={options('Draft','Revised','Final')} bind:value={status}/>
    <Select label="Planning" options={options('Fixed','Flexible','Undefined')} bind:value={planning}/>
  </div>
  <SegmentedControl label="Writing view" options={options('Beats','Page')} bind:value={view} onChange={changeView}/>
  <Checkbox label="Lock scene editing" bind:checked={readonly}/>
  <div class="writing-pages od-stack" data-view={view} style="--od-gap:16px">
    <header hidden={view!=='Page'}><h3>The Beginning</h3><p>Act 1 · Scene prose</p></header>
    <!-- Both editors remain mounted: view changes never serialize or reset their history. -->
    <BeatItem number={1} title="Arrival at the harbor" bind:open={firstOpen}>
      <NovelEditor content={prose} {readonly} label="Opening beat prose" onUpdate={(html)=>prose=html}/>
    </BeatItem>
    <BeatItem number={2} title="The letter" bind:open={secondOpen}>
      <NovelEditor content={letter} {readonly} label="The letter prose" onUpdate={(html)=>letter=html}/>
    </BeatItem>
  </div>
  <p class="writing-note">{sceneType} scene · {status} · {planning}. Both views share the same rich text and editor history. Changes remain local.</p>
</div>

<style>
  .writing-metadata{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
  .writing-pages :global(.ka-beat-body){padding:0}
  .writing-pages[data-view=Page] :global(.ka-beat>summary){display:none}
  .writing-pages[data-view=Page] :global(.ka-beat){border:0;border-radius:0;background:transparent}
  .writing-pages[data-view=Page] :global(.ka-beat-body){border:0}
  .writing-pages header p,.writing-note{font:14px/1.6 var(--font-ui);color:var(--color-text-muted)}
  .writing-pages header h3{font-family:var(--font-display)}
  @media(max-width:767px){.writing-metadata{grid-template-columns:1fr}}
</style>
