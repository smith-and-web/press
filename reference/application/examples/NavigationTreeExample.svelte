<script lang="ts">
  import { NavigationTree } from '../../../design-system/svelte';
  import type { TreeNode } from '../../../design-system/svelte';
  let selected = $state('opening');
  const nodes: TreeNode[] = [
    { id: 'act1', label: 'Act 1', children: [
      { id: 'opening', label: 'The Beginning', meta: '15 words' },
      { id: 'discovery', label: 'Discovery', meta: '15 words' }
    ] },
    { id: 'act2', label: 'Act 2', expanded: false, children: [
      { id: 'turning', label: 'Turning Point', meta: '0 words' },
      { id: 'archived', label: 'Archived scene', disabled: true }
    ] }
  ];
  const selectedName = $derived(nodes.flatMap(node => node.children || []).find(node => node.id === selected)?.label);
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <NavigationTree label="Manuscript scenes" {nodes} bind:selected />
  <p role="status">Selected scene: {selectedName}</p>
</div>
