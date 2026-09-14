<script lang="ts">
  import { BeatItem, Checkbox } from '../../../design-system/svelte';
  import { NovelEditor } from '../../../design-system/svelte/editor';
  let open = $state(true);
  let readonly = $state(false);
  let prose = $state('<p>Mara reached the harbor <em>before dawn</em>.</p><p>The lantern shone over the water. She unfolded the letter and read the first line again.</p><p><strong>Come home.</strong> Nothing else. No name, no date, only those two words.</p>');
  let letter = $state('<p>She carried the letter home, folded carefully inside her coat.</p>');
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <Checkbox label="Lock prose editing" bind:checked={readonly} helper="Read-only mode preserves the full manuscript page." />
  <BeatItem number={1} title="Arrival at the harbor" bind:open>
    <NovelEditor content={prose} {readonly} label="Arrival at the harbor prose"
      onUpdate={(html)=>prose=html} />
  </BeatItem>
  <BeatItem number={2} title="The letter">
    <NovelEditor content={letter} {readonly} label="The letter prose"
      onUpdate={(html)=>letter=html} />
  </BeatItem>
  <p role="status">The first beat is {open ? 'expanded' : 'collapsed'}. Edits stay in this example.</p>
</div>

<style>
  .press-app :global(.ka-beat-body){padding:0}
</style>
