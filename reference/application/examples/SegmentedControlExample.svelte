<script lang="ts">
  import { SegmentedControl } from '../../../design-system/svelte';
  let value = $state('beats');
  const options = [
    { value: 'beats', label: 'Beats' },
    { value: 'page', label: 'Page' },
    { value: 'review', label: 'Review', disabled: true }
  ];
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <SegmentedControl label="Writing view" {options} bind:value />
  <p role="status">The {value === 'beats' ? 'beat outline' : 'manuscript page'} is selected.</p>
</div>
