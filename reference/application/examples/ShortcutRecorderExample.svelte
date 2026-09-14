<script lang="ts">
  import { ShortcutRecorder } from '../../../design-system/svelte';
  let shortcut = $state('Meta+F');
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <ShortcutRecorder label="Find in scene" bind:value={shortcut}
    isReserved={(value) => value === 'Ctrl+Alt+Delete'} />
  <p role="status">Assigned shortcut: {shortcut || 'none'}</p>
  <p class="ka-help">Select the shortcut and press a combination. Escape cancels; Tab leaves the recorder.</p>
</div>
