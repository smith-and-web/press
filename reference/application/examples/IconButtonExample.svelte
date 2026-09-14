<script lang="ts">
  import { IconButton } from '../../../design-system/svelte';
  let pinned = $state(false);
  let result = $state('No action selected.');
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <div class="ka-row">
    <IconButton icon="plus" label="Add a scene" onclick={() => result = 'New scene requested.'} />
    <IconButton icon="check" label="Mark scene reviewed" aria-pressed={pinned}
      onclick={() => { pinned = !pinned; result = pinned ? 'Scene marked reviewed.' : 'Review mark removed.'; }} />
    <IconButton icon="history" label="View unavailable history" disabled />
  </div>
  <p role="status">{result}</p>
</div>
