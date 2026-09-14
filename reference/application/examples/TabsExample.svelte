<script lang="ts">
  import { Tabs, Field } from '../../../design-system/svelte';
  let tab = $state('synopsis');
  let synopsis = $state('Mara reaches the harbor.');
  const items = [
    { value: 'synopsis', label: 'Synopsis' },
    { value: 'notes', label: 'Notes' },
    { value: 'history', label: 'History', disabled: true }
  ];
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <Tabs label="Scene panels" {items} bind:value={tab}>
    {#snippet children(active)}
      {#if active === 'synopsis'}
        <Field label="Synopsis" multiline bind:value={synopsis} />
      {:else}
        <p>Your synopsis is preserved when switching panels: {synopsis}</p>
      {/if}
    {/snippet}
  </Tabs>
</div>
