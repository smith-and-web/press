export const recipes = [
  {
    "id": "actions",
    "title": "Actions & fields",
    "description": "Buttons, inputs, validation and feedback.",
    "components": [
      "Button",
      "IconButton",
      "Field",
      "Checkbox",
      "Select",
      "Badge",
      "Notice"
    ],
    "baseline": "01-01-chapter-input",
    "code": "<script lang=\"ts\">\n  import { Button, Field, Badge } from '@kindling/design-system/svelte';\n  import '@kindling/design-system/fonts.css';\n  import '@kindling/design-system/tokens.css';\n  import '@kindling/design-system/application.css';\nlet title = $state('The Beginning');\nlet error = $state('');\n</script>\n\n<div class=\"press-app\">\n<Field label=\"Chapter title\" bind:value={title} required {error} />\n<Button onclick={() => error = title.trim() ? '' : 'Enter a title.'}>Save title</Button>\n<Badge label=\"Draft\" />\n</div>"
  },
  {
    "id": "navigation",
    "title": "Project navigation",
    "description": "Act and scene hierarchies with clear selection.",
    "components": [
      "NavigationTree",
      "Progress",
      "IconButton",
      "Panel"
    ],
    "baseline": "01-09-scene-selected",
    "code": "<script lang=\"ts\">\n  import { NavigationTree } from '@kindling/design-system/svelte';\n  import '@kindling/design-system/fonts.css';\n  import '@kindling/design-system/tokens.css';\n  import '@kindling/design-system/application.css';\nlet selected = $state('scene-1');\nconst nodes = [{ id: 'act-1', label: 'Act 1', children: [\n  { id: 'scene-1', label: 'The Beginning', meta: '15 words' }\n]}];\n</script>\n\n<div class=\"press-app\">\n<NavigationTree label=\"Manuscript\" {nodes} bind:selected\n  onSelect={(id) => console.log('Select scene', id)} />\n</div>"
  },
  {
    "id": "writing",
    "title": "Writing surfaces",
    "description": "Page-like Tiptap prose, full formatting, and persistent Beats/Page editor state.",
    "components": [
      "BeatItem",
      "NovelEditor",
      "ProseToolbar",
      "SegmentedControl",
      "Select",
      "Checkbox"
    ],
    "baseline": "07-00-beat-prose",
    "code": "<script lang=\"ts\">\n  import '@kindling/design-system/fonts.css';\n  import '@kindling/design-system/tokens.css';\n  import '@kindling/design-system/application.css';\n  import { BeatItem, SegmentedControl, Select, Checkbox } from '@kindling/design-system/svelte';\n  import { NovelEditor } from '@kindling/design-system/svelte/editor';\n  const options=(...labels:string[])=>labels.map(label=>({label,value:label}));\n  let view=$state('Beats'), sceneType=$state('Normal'), status=$state('Draft'), planning=$state('Fixed');\n  let readonly=$state(false), firstOpen=$state(true), secondOpen=$state(false);\n  let previousOpen=[true,false];\n  let prose=$state('<p>Mara reached the harbor. The lantern shone over the water.</p><p>She turned the letter over in her hands. <em>Come home</em>, it said. Nothing else.</p>');\n  let letter=$state('<p>She carried the letter home.</p><p>At the door, she paused. A light was still burning in the upstairs window.</p>');\n  function changeView(next:string){\n    if(next==='Page'){previousOpen=[firstOpen,secondOpen];firstOpen=true;secondOpen=true;}\n    else [firstOpen,secondOpen]=previousOpen;\n  }\n</script>\n\n<div class=\"press-app od-stack writing-example\" style=\"--od-gap:24px\">\n  <div class=\"writing-metadata\">\n    <Select label=\"Scene type\" options={options('Normal','Flashback','Flashforward')} bind:value={sceneType}/>\n    <Select label=\"Status\" options={options('Draft','Revised','Final')} bind:value={status}/>\n    <Select label=\"Planning\" options={options('Fixed','Flexible','Undefined')} bind:value={planning}/>\n  </div>\n  <SegmentedControl label=\"Writing view\" options={options('Beats','Page')} bind:value={view} onChange={changeView}/>\n  <Checkbox label=\"Lock scene editing\" bind:checked={readonly}/>\n  <div class=\"writing-pages od-stack\" data-view={view} style=\"--od-gap:16px\">\n    <header hidden={view!=='Page'}><h3>The Beginning</h3><p>Act 1 · Scene prose</p></header>\n    <!-- Both editors remain mounted: view changes never serialize or reset their history. -->\n    <BeatItem number={1} title=\"Arrival at the harbor\" bind:open={firstOpen}>\n      <NovelEditor content={prose} {readonly} label=\"Opening beat prose\" onUpdate={(html)=>prose=html}/>\n    </BeatItem>\n    <BeatItem number={2} title=\"The letter\" bind:open={secondOpen}>\n      <NovelEditor content={letter} {readonly} label=\"The letter prose\" onUpdate={(html)=>letter=html}/>\n    </BeatItem>\n  </div>\n  <p class=\"writing-note\">{sceneType} scene · {status} · {planning}. Both views share the same rich text and editor history. Changes remain local.</p>\n</div>\n\n<style>\n  .writing-metadata{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}\n  .writing-pages :global(.ka-beat-body){padding:0}\n  .writing-pages[data-view=Page] :global(.ka-beat>summary){display:none}\n  .writing-pages[data-view=Page] :global(.ka-beat){border:0;border-radius:0;background:transparent}\n  .writing-pages[data-view=Page] :global(.ka-beat-body){border:0}\n  .writing-pages header p,.writing-note{font:14px/1.6 var(--font-ui);color:var(--color-text-muted)}\n  .writing-pages header h3{font-family:var(--font-display)}\n  @media(max-width:767px){.writing-metadata{grid-template-columns:1fr}}\n</style>\n"
  },
  {
    "id": "tags",
    "title": "Tags & status",
    "description": "Removable metadata and distinct status labels.",
    "components": [
      "TagPicker",
      "Badge"
    ],
    "baseline": "09-05-tags",
    "code": "<script lang=\"ts\">\n  import { TagPicker, Badge } from '@kindling/design-system/svelte';\n  import '@kindling/design-system/fonts.css';\n  import '@kindling/design-system/tokens.css';\n  import '@kindling/design-system/application.css';\nlet selected = $state(['character']);\nconst tags = [{ value: 'character', label: 'Character' }, { value: 'setting', label: 'Setting' }];\n</script>\n\n<div class=\"press-app\">\n<TagPicker options={tags} bind:value={selected}\n  onChange={(ids) => console.log('Tag IDs', ids)} />\n<Badge label=\"Needs review\" tone=\"warning\" />\n</div>"
  },
  {
    "id": "references",
    "title": "Reference library",
    "description": "Create, filter and open character references.",
    "components": [
      "Panel",
      "Field",
      "SearchResults",
      "Dialog",
      "EmptyState"
    ],
    "baseline": "08-01-reference-dialog",
    "code": "<script lang=\"ts\">\n  import { Panel, SearchResults } from '@kindling/design-system/svelte';\n  import '@kindling/design-system/fonts.css';\n  import '@kindling/design-system/tokens.css';\n  import '@kindling/design-system/application.css';\nconst references = [{ id: 'mara', title: 'Mara', excerpt: 'The story’s protagonist.' }];\n</script>\n\n<div class=\"press-app\">\n<Panel title=\"References\">\n  <SearchResults items={references} onSelect={(id) => console.log('Open', id)} />\n</Panel>\n</div>"
  },
  {
    "id": "settings",
    "title": "Settings & custom fields",
    "description": "Appearance choices, guidance and typed inputs.",
    "components": [
      "SegmentedControl",
      "Checkbox",
      "Field",
      "Select"
    ],
    "baseline": "09-01-appearance-guidance",
    "code": "<script lang=\"ts\">\n  import { SegmentedControl, Checkbox } from '@kindling/design-system/svelte';\n  import '@kindling/design-system/fonts.css';\n  import '@kindling/design-system/tokens.css';\n  import '@kindling/design-system/application.css';\nlet theme = $state('System');\nlet guidance = $state(true);\n</script>\n\n<div class=\"press-app\">\n<SegmentedControl label=\"Appearance\" bind:value={theme}\n  options={['Dark', 'Light', 'System'].map(value => ({ value, label: value }))} />\n<Checkbox label=\"Show guidance tips\" bind:checked={guidance} />\n</div>"
  },
  {
    "id": "dialogs",
    "title": "Dialogs & menus",
    "description": "Focused decisions with explicit return paths.",
    "components": [
      "Dialog",
      "Menu",
      "Button"
    ],
    "baseline": "07-02-switch-confirm",
    "code": "<script lang=\"ts\">\n  import { Dialog, Button, Menu } from '@kindling/design-system/svelte';\n  import '@kindling/design-system/fonts.css';\n  import '@kindling/design-system/tokens.css';\n  import '@kindling/design-system/application.css';\nlet open = $state(false);\n</script>\n\n<div class=\"press-app\">\n<Button onclick={() => open = true}>Open details</Button>\n<Dialog bind:open title=\"Project details\">\n  <p>Your app supplies the form and save handler.</p>\n  {#snippet footer()}<Button onclick={() => open = false}>Done</Button>{/snippet}\n</Dialog>\n<Menu items={[{ id: 'rename', label: 'Rename scene' }]}\n  onSelect={(id) => console.log(id)} />\n</div>"
  },
  {
    "id": "commands",
    "title": "Commands & shortcuts",
    "description": "Searchable commands and local key recording.",
    "components": [
      "CommandPalette",
      "ShortcutRecorder",
      "Button"
    ],
    "baseline": "10-04-command-palette",
    "code": "<script lang=\"ts\">\n  import { CommandPalette, ShortcutRecorder, Button } from '@kindling/design-system/svelte';\n  import '@kindling/design-system/fonts.css';\n  import '@kindling/design-system/tokens.css';\n  import '@kindling/design-system/application.css';\nlet open = $state(false);\nlet shortcut = $state('Meta+F');\nconst commands = [{ id: 'find', label: 'Find in scene', shortcut: '⌘F' }];\n</script>\n\n<div class=\"press-app\">\n<Button onclick={() => open = true}>Open commands</Button>\n<CommandPalette bind:open {commands} onSelect={(id) => console.log(id)} />\n<ShortcutRecorder label=\"Find in scene\" bind:value={shortcut} />\n</div>"
  },
  {
    "id": "search",
    "title": "Find & replace",
    "description": "Highlighted results, confirmation and undo.",
    "components": [
      "SearchResults",
      "Field",
      "Dialog",
      "Notice"
    ],
    "baseline": "15-01-project-results",
    "code": "<script lang=\"ts\">\n  import { SearchResults } from '@kindling/design-system/svelte';\n  import '@kindling/design-system/fonts.css';\n  import '@kindling/design-system/tokens.css';\n  import '@kindling/design-system/application.css';\nconst items = [{ id: 'opening', title: 'The Beginning', path: 'Act 1', excerpt: 'The lantern shone over the water.' }];\n</script>\n\n<div class=\"press-app\">\n<SearchResults {items} query=\"lantern\" onSelect={(id) => console.log(id)} />\n</div>"
  },
  {
    "id": "statistics",
    "title": "Progress & history",
    "description": "Writing counts, session progress and saved points.",
    "components": [
      "StatGroup",
      "Progress",
      "Panel",
      "BeatItem",
      "EmptyState"
    ],
    "baseline": "16-03-writing-statistics",
    "code": "<script lang=\"ts\">\n  import { StatGroup, Progress } from '@kindling/design-system/svelte';\n  import '@kindling/design-system/fonts.css';\n  import '@kindling/design-system/tokens.css';\n  import '@kindling/design-system/application.css';\n\n</script>\n\n<div class=\"press-app\">\n<StatGroup items={[{ label: 'Project words', value: 30 }, { label: 'Streak', value: 0, unit: 'days' }]} />\n<Progress label=\"Daily writing goal\" value={30} max={500} />\n</div>"
  },
  {
    "id": "editorial",
    "title": "Editorial review",
    "description": "A manuscript surface beside review and reference panels.",
    "components": [
      "ManuscriptSurface",
      "Tabs",
      "Panel",
      "Field",
      "Notice",
      "EmptyState"
    ],
    "baseline": "17-01-editorial-workspace",
    "code": "<script lang=\"ts\">\n  import { Tabs, ManuscriptSurface } from '@kindling/design-system/svelte';\n  import '@kindling/design-system/fonts.css';\n  import '@kindling/design-system/tokens.css';\n  import '@kindling/design-system/application.css';\nlet tab = $state('review');\n</script>\n\n<div class=\"press-app\">\n<Tabs label=\"Editorial panels\" bind:value={tab}\n  items={[{ value: 'review', label: 'Review' }, { value: 'references', label: 'References' }]}>\n  {#snippet children(active)}<p>Current panel: {active}</p>{/snippet}\n</Tabs>\n<ManuscriptSurface title=\"Act 1\"><p>Mara reached the harbor.</p></ManuscriptSurface>\n</div>"
  },
  {
    "id": "export",
    "title": "Export workspace",
    "description": "Profile choices, content selection and reading surfaces.",
    "components": [
      "Select",
      "Checkbox",
      "NavigationTree",
      "ManuscriptSurface",
      "EmptyState",
      "Button"
    ],
    "baseline": "19-04-export-selection",
    "code": "<script lang=\"ts\">\n  import { Select, Checkbox } from '@kindling/design-system/svelte';\n  import '@kindling/design-system/fonts.css';\n  import '@kindling/design-system/tokens.css';\n  import '@kindling/design-system/application.css';\nlet format = $state('html');\nlet selected = $state(false);\n</script>\n\n<div class=\"press-app\">\n<Select label=\"Output format\" bind:value={format}\n  options={[{ value: 'html', label: 'Web / HTML' }, { value: 'epub', label: 'EPUB' }]} />\n<Checkbox label=\"Act 1\" bind:checked={selected} />\n</div>"
  }
];
