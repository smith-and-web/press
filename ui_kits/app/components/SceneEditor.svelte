<script lang="ts">
  import { Select, Checkbox } from '../../../design-system/svelte';
  import { NovelEditor } from '../../../design-system/svelte/editor';
  let { scene, onContent, onStatus, onType }: {
    scene:{id:string;title:string;content:string;status:string;type:string};
    onContent:(html:string)=>void; onStatus:(status:string)=>void; onType:(type:string)=>void;
  }=$props();
  let readonly=$state(false);
  const options=(...labels:string[])=>labels.map(label=>({label,value:label}));
</script>
<section class="kit-scene od-stack" aria-label={scene.title}>
  <header class="od-field"><p class="kit-eyebrow">Scene prose</p><h1>{scene.title}</h1></header>
  <div class="kit-metadata">
    <Select label="Scene type" options={options('Normal','Flashback','Flashforward')} value={scene.type} onChange={onType}/>
    <Select label="Draft status" options={options('Draft','Revised','Final')} value={scene.status} onChange={onStatus}/>
    <Checkbox label="Lock editing" bind:checked={readonly}/>
  </div>
  <NovelEditor content={scene.content} sceneId={scene.id} label={`${scene.title} prose`} {readonly} onUpdate={onContent}/>
</section>
