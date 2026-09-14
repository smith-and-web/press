<script lang="ts">
  import { Panel, Button } from '../../../design-system/svelte';
  let count = $state(0);
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <Panel title="References" subtitle="Characters linked to this scene">
    {#snippet actions()}
      <Button variant="secondary" onclick={() => count += 1}>Add sample</Button>
    {/snippet}
    <p role="status">{count ? `${count} sample references added.` : 'No references added yet.'}</p>
  </Panel>
</div>
