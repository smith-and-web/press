<script lang="ts">
  import { Checkbox } from '../../../design-system/svelte';
  let guidance = $state(true);
  let archive = $state(false);
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <Checkbox label="Show guidance tips" bind:checked={guidance} helper="Contextual hints for new writing workflows." />
  <Checkbox label="Include archived scenes" bind:checked={archive} />
  <Checkbox label="Managed by your project" checked disabled />
  <p role="status">Guidance {guidance ? 'on' : 'off'} · Archived scenes {archive ? 'included' : 'excluded'}</p>
</div>
