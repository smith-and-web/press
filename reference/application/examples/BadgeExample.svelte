<script lang="ts">
  import { Badge } from '../../../design-system/svelte';

</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <div class="ka-row">
    <Badge label="Draft" />
    <Badge label="Fixed" tone="accent" />
    <Badge label="Saved" tone="success" />
    <Badge label="Save failed" tone="error" />
    <Badge label="Needs review" tone="warning" />
  </div>
  <p>These are illustrative labels; badges do not change application state.</p>
</div>
