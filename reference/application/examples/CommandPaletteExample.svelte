<script lang="ts">
  import { CommandPalette, Button } from '../../../design-system/svelte';
  let open = $state(false);
  let result = $state('No command selected.');
  const commands = [
    { id: 'new', label: 'New scene', group: 'Writing', shortcut: '⌘N', keywords: ['create'] },
    { id: 'find', label: 'Find in scene', group: 'Editing', shortcut: '⌘F', keywords: ['search'] },
    { id: 'settings', label: 'Open settings', group: 'Application', keywords: ['preferences'] }
  ];
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <Button onclick={() => open = true}>Open command palette</Button>
  <p role="status">{result}</p>
  <CommandPalette bind:open {commands}
    onSelect={(id) => result = `${commands.find(command => command.id === id)?.label} requested in this example.`} />
</div>
