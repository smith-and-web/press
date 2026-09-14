<script lang="ts">
import { examples } from './examples';
import CodeExample from './CodeExample.svelte';
</script>
<section id="app-component-examples" class="ac-full-examples" aria-labelledby="app-full-examples-heading">
  <header class="ac-recipe-heading">
    <div><p class="ac-overline">Component library / complete examples</p>
    <h3 id="app-full-examples-heading">Every component, in use.</h3>
    <p>All 22 public components, each with a live specimen and complete Svelte source. Changes stay within their example.</p></div>
  </header>
  <nav class="ac-component-index" aria-label="Individual app components">
    {#each examples as example,index}
      <a href={`#app-example-${example.name}`}><span class="ac-recipe-number">{String(index+1).padStart(2,'0')}</span><span>{example.name}</span></a>
    {/each}
  </nav>
  {#each examples as example,index}
    <article id={`app-example-${example.name}`} class="ac-full-example" aria-labelledby={`app-example-heading-${example.name}`}>
      <header class="ac-recipe-heading">
        <div><p class="ac-overline">Component {String(index+1).padStart(2,'0')} / 22</p>
          <h3 id={`app-example-heading-${example.name}`}>{example.name}</h3>
          <p>{example.description}</p>
        </div>
        <a class="ac-text-link" href="#app-component-examples" aria-label={`Back to component index from ${example.name}`}>Index ↑</a>
      </header>
      <div class="ac-specimen"><example.component /></div>
      <p class="ac-example-states"><strong>Included states</strong> {example.states}</p>
      <CodeExample code={example.code}/>
      <p class="ac-example-file">Example source: <a href={`reference/application/examples/${example.name}Example.svelte`}>{example.name}Example.svelte</a></p>
    </article>
  {/each}
</section>
