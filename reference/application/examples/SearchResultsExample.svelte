<script lang="ts">
  import { SearchResults, Field, Dialog } from '../../../design-system/svelte';
  let query = $state('lantern');
  let selected = $state('');
  let open = $state(false);
  const items = Array.from({ length: 12 }, (_, index) => ({
    id: `scene-${index + 1}`,
    title: `Sample scene ${index + 1}`,
    path: `Act ${Math.floor(index / 4) + 1}`,
    excerpt: index % 2 ? 'The lantern was still burning by the door.' : 'Mara watched the lantern over the harbor.'
  }));
  const filtered = $derived(items.filter(item => item.excerpt.toLowerCase().includes(query.toLowerCase())));
  const detail = $derived(items.find(item => item.id === selected));
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <Field label="Search sample prose" type="search" bind:value={query} />
  <SearchResults items={filtered} {query}
    onSelect={(id) => { selected = id; open = true; }} />
  <Dialog bind:open title={detail?.title || 'Scene detail'}>
    <p>{detail?.path}</p>
    <p>{detail?.excerpt}</p>
  </Dialog>
</div>
