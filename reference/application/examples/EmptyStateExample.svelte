<script lang="ts">
  import { EmptyState, Button } from '../../../design-system/svelte';
  let created = $state(false);
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  {#if created}
    <p role="status">Your first sample scene is ready.</p>
    <Button variant="secondary" onclick={() => created = false}>Reset example</Button>
  {:else}
    <EmptyState title="No scenes yet" description="Create a scene to begin your manuscript." icon="book-open">
      <Button onclick={() => created = true}>Create a scene</Button>
    </EmptyState>
  {/if}
</div>
