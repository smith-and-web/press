<script lang="ts">
  import { Dialog, Field, Button } from '../../../design-system/svelte';
  let open = $state(false);
  let title = $state('The Beginning');
  let error = $state('');
  let result = $state('');
  function save() {
    error = title.trim() ? '' : 'Enter a title before saving.';
    if (error) return;
    result = `Saved “${title.trim()}” in this example.`;
    open = false;
  }
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <Button onclick={() => { open = true; error = ''; }}>Edit scene title</Button>
  <p role="status">{result}</p>
  <Dialog bind:open title="Edit scene" subtitle="Simple Story / Act 1">
    <Field label="Title" bind:value={title} required {error} />
    {#snippet footer()}
      <Button variant="secondary" onclick={() => open = false}>Cancel</Button>
      <Button onclick={save}>Save title</Button>
    {/snippet}
  </Dialog>
</div>
