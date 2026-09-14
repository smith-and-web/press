<script lang="ts">
  import { TagPicker } from '../../../design-system/svelte';
  let selected = $state(['character']);
  const options = [
    { value: 'character', label: 'Character' },
    { value: 'setting', label: 'Setting' },
    { value: 'research', label: 'Research' },
    { value: 'plot', label: 'Plot thread' }
  ];
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <TagPicker label="Scene tags" {options} bind:value={selected} />
  <p role="status">Selected IDs: {selected.length ? selected.join(', ') : 'none'}</p>
</div>
