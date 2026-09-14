<script lang="ts">
  import { Button, Dialog } from '../../../design-system/svelte';
  let saving = $state(false);
  let confirm = $state(false);
  let result = $state('Choose an action.');
  async function save() {
    saving = true;
    result = 'Saving the sample…';
    await new Promise(resolve => setTimeout(resolve, 450));
    saving = false;
    result = 'Sample saved for this example.';
  }
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <div class="ka-row">
    <Button busy={saving} onclick={save}>{saving ? 'Saving…' : 'Save draft'}</Button>
    <Button variant="secondary" onclick={() => result = 'Secondary action selected.'}>Save a copy</Button>
    <Button variant="ghost" onclick={() => result = 'Action canceled.'}>Cancel</Button>
    <Button variant="danger" onclick={() => confirm = true}>Delete sample</Button>
    <Button disabled>Unavailable</Button>
  </div>
  <p role="status">{result}</p>
  <Dialog bind:open={confirm} title="Delete the sample?">
    <p>This only changes the example’s status message.</p>
    {#snippet footer()}
      <Button variant="secondary" onclick={() => confirm = false}>Cancel</Button>
      <Button variant="danger" onclick={() => { confirm = false; result = 'Sample deleted.'; }}>Delete sample</Button>
    {/snippet}
  </Dialog>
</div>
