<script lang="ts">
  import { Notice, Button } from '../../../design-system/svelte';
  let failed = $state(true);
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <Notice title="Local example" message="Changes here do not affect your manuscript." />
  <Notice title="Draft saved" message="Your sample revision is available." tone="success" />
  <Notice title="Review pending" message="Check the scene before marking it final." tone="warning" />
  {#if failed}
    <Notice title="Sample save failed" message="Retry the example to see recovery feedback." tone="error">
      <Button variant="secondary" onclick={() => failed = false}>Retry sample</Button>
    </Notice>
  {:else}
    <Notice title="Retry complete" message="The sample is ready. No service was contacted." tone="success" />
    <Button variant="ghost" onclick={() => failed = true}>Reset error</Button>
  {/if}
</div>
