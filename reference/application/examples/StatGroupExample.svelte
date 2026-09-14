<script lang="ts">
  import { StatGroup } from '../../../design-system/svelte';

</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <StatGroup items={[
    { label: 'Project words', value: 1250 },
    { label: 'Today', value: 250, unit: 'words' },
    { label: 'Writing streak', value: 3, unit: 'days' },
    { label: 'Manuscript status', value: 'Draft' }
  ]} />
  <p>Illustrative values for this component example.</p>
</div>
