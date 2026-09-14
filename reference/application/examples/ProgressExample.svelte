<script lang="ts">
  import { Progress, Button } from '../../../design-system/svelte';
  let words = $state(125);
  const goal = 500;
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <Progress label="Daily writing goal" value={words} max={goal} />
  <div class="ka-row">
    <Button variant="secondary" disabled={words >= goal} onclick={() => words = Math.min(goal, words + 125)}>Add 125 words</Button>
    <Button variant="ghost" onclick={() => words = 0}>Reset count</Button>
  </div>
  <p role="status">{words >= goal ? 'Daily goal reached in this sample.' : `${goal - words} words to the sample goal.`}</p>
</div>
