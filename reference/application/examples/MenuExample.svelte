<script lang="ts">
  import { Menu } from '../../../design-system/svelte';
  let result = $state('No action selected.');
  const items = [
    { id: 'rename', label: 'Rename scene' },
    { id: 'duplicate', label: 'Duplicate scene' },
    { id: 'history', label: 'View draft history', disabled: true }
  ];
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <Menu label="Scene actions" {items}
    onSelect={(id) => result = `${items.find(item => item.id === id)?.label} requested.`} />
  <p role="status">{result}</p>
</div>
