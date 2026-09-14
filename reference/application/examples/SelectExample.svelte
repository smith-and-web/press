<script lang="ts">
  import { Select } from '../../../design-system/svelte';
  let status = $state('draft');
  const options = [
    { value: 'draft', label: 'Draft' },
    { value: 'revised', label: 'Revised' },
    { value: 'final', label: 'Final', disabled: true }
  ];
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <Select label="Scene status" {options} bind:value={status} helper="Final is unavailable until review is complete." />
  <Select label="Locked status" {options} value="draft" disabled />
  <p role="status">Current status: {options.find(option => option.value === status)?.label}</p>
</div>
