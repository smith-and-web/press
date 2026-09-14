<script lang="ts">
  import ButtonExample from '../reference/application/examples/ButtonExample.svelte';
  import FieldExample from '../reference/application/examples/FieldExample.svelte';
  import DialogExample from '../reference/application/examples/DialogExample.svelte';
  import WritingExample from '../reference/application/WritingExample.svelte';
  let {kind}:{kind:string}=$props();
</script>
<div class="press-app od-stack" style="--od-gap:32px">
{#if kind==='editor'}
  <WritingExample/>
{:else}
  <section class="od-stack"><h2>Actions</h2><ButtonExample/></section>
  <section class="od-stack"><h2>Fields and feedback</h2><FieldExample/></section>
  <section class="od-stack"><h2>Dialog and return path</h2><DialogExample/></section>
{/if}
</div>
