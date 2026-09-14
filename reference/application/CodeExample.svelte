<script lang="ts">
import {tick} from 'svelte';
import {Button} from '../../design-system/svelte';
let {code}:{code:string}=$props();let copied=$state(false);let manual=$state(false);let textarea=$state<HTMLTextAreaElement>();let timer:ReturnType<typeof setTimeout>;
async function copy(){try{if(!navigator.clipboard||!window.isSecureContext)throw new Error('Manual');await navigator.clipboard.writeText(code);copied=true;clearTimeout(timer);timer=setTimeout(()=>copied=false,1600);}catch{manual=true;await tick();textarea?.focus();textarea?.select();}}
</script>
<details class="ac-code"><summary>Usage & Svelte source</summary><div class="od-stack ac-space"><div class="ka-between"><p class="ka-help">Import from the optional Svelte entry. Connect callbacks to your existing app.</p><Button variant="secondary" onclick={copy}>{copied?'Copied':'Copy Svelte'}</Button></div><pre><code>{code}</code></pre>{#if manual}<label>Copy the selected source<textarea bind:this={textarea} readonly value={code} rows="8"></textarea></label>{/if}<p class="ka-sr" role="status">{copied?'Source copied.':''}</p></div></details>
