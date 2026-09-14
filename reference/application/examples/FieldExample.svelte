<script lang="ts">
  import { Field, Button } from '../../../design-system/svelte';
  let name = $state('The Beginning');
  let email = $state('');
  let synopsis = $state('Mara arrives at the harbor.');
  let error = $state('');
  let result = $state('');
  function submit(event: SubmitEvent) {
    event.preventDefault();
    error = name.trim() ? '' : 'Enter a scene name to continue.';
    result = error ? '' : `Scene “${name.trim()}” updated in this example.`;
  }
</script>

<div class="press-app od-stack" style="--od-gap:var(--ka-gap)">
  <form class="od-stack" style="--od-gap:var(--ka-gap)" onsubmit={submit} novalidate>
    <Field label="Scene name" bind:value={name} required {error} helper="Clear the name and leave the field to see validation." />
    <Field label="Contact email" type="email" bind:value={email} helper="Email format is checked when you leave this field." />
    <Field label="Synopsis" multiline bind:value={synopsis} />
    <Field label="Project reference" value="Simple Story" readonly />
    <Field label="Archived identifier" value="Not available" disabled />
    <Button type="submit">Update scene</Button>
    <p role="status">{result}</p>
  </form>
</div>
