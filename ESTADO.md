# Estado en el directorio de Obsidian

Generado por `.github/workflows/directorio.yml` con `directory/estado.mjs`. Hallazgos: los que no son `pass` ni `info` en la ficha pública.

| Plugin | Release en GitHub | Directorio | Revisión | Hallazgos | Qué hacer |
|---|---|---|---|---|---|
| [Shared Blocks](https://community.obsidian.md/plugins/shared-blocks) | 0.6.0 | 0.6.0 | Passed | ninguno | nada |
| [Text Case and Cleanup](https://community.obsidian.md/plugins/text-format) | 0.8.0 | 0.8.0 | Passed | ninguno | nada |
| [Typography as You Type](https://community.obsidian.md/plugins/typography-as-you-type) | 0.9.0 | 0.9.0 | Passed | ninguno | nada |
| [Section Numbering](https://community.obsidian.md/plugins/section-numbering) | 0.11.0 | 0.11.0 | Passed | ninguno | nada |
| [Spreadsheet to Table](https://community.obsidian.md/plugins/spreadsheet-to-table) | 0.5.3 | 0.5.3 | Passed | ninguno | nada |
| [Hybrid Line Numbers](https://community.obsidian.md/plugins/hybrid-line-numbers) | 0.3.0 | 0.3.0 | Passed | ninguno | nada |
| [List Item Callouts](https://community.obsidian.md/plugins/list-item-callouts) | 0.4.1 | 0.4.1 | Passed | ninguno | nada |
| [Folder Counts](https://community.obsidian.md/plugins/folder-counts) | 0.3.1 | 0.3.1 | Passed | ninguno | nada |
| [Note Reading Time](https://community.obsidian.md/plugins/note-reading-time) | 0.2.0 | 0.2.0 | Passed | ninguno | nada |
| [Task Rollover](https://community.obsidian.md/plugins/task-rollover) | 0.2.1 | 0.2.1 | Passed | ninguno | nada |
| [Zoom Into Section](https://community.obsidian.md/plugins/zoom-into-section) | 0.2.0 | 0.2.0 | Passed | ninguno | nada |
| [Link Title on Paste](https://community.obsidian.md/plugins/link-title-on-paste) | 0.2.0 | 0.2.0 | Passed | ninguno | nada |
| [Update Radar](https://community.obsidian.md/plugins/update-radar) | 0.7.0 | 0.7.0 | Passed | ninguno | nada |
| [Dataview to Bases](https://community.obsidian.md/plugins/dataview-to-bases) | 0.3.0 | 0.3.0 | Passed | ninguno | nada |
| [Line Editing Commands](https://community.obsidian.md/plugins/line-editing-commands) | 0.2.1 | 0.2.1 | Passed | ninguno | nada |
| [Note Mover Rules](https://community.obsidian.md/plugins/note-mover-rules) | 0.2.0 | 0.2.0 | Passed | ninguno | nada |
| [Tab History](https://community.obsidian.md/plugins/tab-history) | 0.3.1 | 0.3.1 | Satisfactory | 1 medium | nada |
| [URL Cards](https://community.obsidian.md/plugins/url-cards) | 0.2.0 | 0.2.0 | Passed | ninguno | nada |
| [Vim Config](https://community.obsidian.md/plugins/vim-config) | 0.1.1 | 0.1.1 | Passed | ninguno | nada |
| [Task Archive](https://community.obsidian.md/plugins/task-archive) | 0.1.0 | 0.1.0 | Passed | ninguno | nada |
| [Revisit Later](https://community.obsidian.md/plugins/revisit-later) | 0.1.0 | 0.1.0 | Passed | ninguno | nada |
| [Explorer Colors Plus](https://community.obsidian.md/plugins/explorer-colors-plus) | 0.1.2 | 0.1.2 | Passed | ninguno | nada |
| [Book Lookup](https://community.obsidian.md/plugins/book-lookup) | 0.1.0 | 0.1.0 | Passed | ninguno | nada |
| [Web Search Menu](https://community.obsidian.md/plugins/web-search-menu) | 0.1.0 | 0.1.0 | Passed | ninguno | nada |
| [Word Lookup](https://community.obsidian.md/plugins/word-lookup) | 0.1.0 | 0.1.0 | Passed | ninguno | nada |
| [Quick Translate](https://community.obsidian.md/plugins/quick-translate) | 0.1.1 | 0.1.1 | Passed | ninguno | nada |
| [Dice Rolls](https://community.obsidian.md/plugins/dice-rolls) | 0.2.0 | 0.2.0 | Satisfactory | 1 medium | nada |
| [Claude Studio](https://community.obsidian.md/plugins/claude-studio) | 0.1.4 | 0.1.4 | Satisfactory | 3 medium | nada |
| [Book Studio](https://community.obsidian.md/plugins/book-studio) | 0.3.0 | 0.3.0 | Caution | 20 medium | revisión Caution: medium, Uses `document.createElement` instead of Obsidian's `createEl` helpers |
| [Inline TOC](https://community.obsidian.md/plugins/inline-toc) | 0.1.0 | 0.1.0 | Passed | ninguno | nada |
| [Emoji Search](https://community.obsidian.md/plugins/emoji-search) | 0.1.0 | 0.1.0 | Satisfactory | 2 medium | nada |
| [Random Note Filters](https://community.obsidian.md/plugins/random-note-filters) | 0.1.0 | 0.1.0 | Passed | ninguno | nada |
| [Run Code Blocks](https://community.obsidian.md/plugins/run-code-blocks) | 0.1.0 | 0.1.0 | Satisfactory | 4 medium | nada |
| [Canvas Finder](https://community.obsidian.md/plugins/canvas-finder) | 0.1.0 | 0.1.0 | Passed | ninguno | nada |
| [Folder Index Notes](https://community.obsidian.md/plugins/folder-index-notes) | 0.1.0 | 0.1.0 | Satisfactory | 1 medium | nada |

## Hallazgos

### Tab History 0.3.1

- **medium**: This assertion is unnecessary since it does not change the type of the expression.

### Dice Rolls 0.2.0

- **medium**: Unexpected browser feature "text-decoration" is only partially supported by Obsidian 1.4.5

### Claude Studio 0.1.4

- **medium**: Plugin reads system identity information (hostname, user info, or environment variables)
- **medium**: **Direct Filesystem Access**: Uses the Node.js `fs` module to access the filesystem outside of the Obsidian vault API. Can read and write any file on the system.
- **medium**: **Shell Execution**: Executes shell commands via `child_process`. Gives the plugin full control over the system.

### Book Studio 0.3.0

- **medium**: Uses `document.createElement` instead of Obsidian's `createEl` helpers
- **medium**: Unexpected use of 'fetch'. Use the built-in `requestUrl` function instead of `fetch` for network requests in Obsidian.
- **medium**: Do not import Node.js built-in module "node:path". Node.js APIs are not available on mobile. Use a dynamic import() or require() guarded by Platform.isDesktop instead.
- **medium**: Do not import Node.js built-in module "node:fs". Node.js APIs are not available on mobile. Use a dynamic import() or require() guarded by Platform.isDesktop instead.
- **medium**: Do not import Node.js built-in module "node:fs/promises". Node.js APIs are not available on mobile. Use a dynamic import() or require() guarded by Platform.isDesktop instead.
- **medium**: Do not import Node.js built-in module "node:child_process". Node.js APIs are not available on mobile. Use a dynamic import() or require() guarded by Platform.isDesktop instead.
- **medium**: Do not import Node.js built-in module "node:os". Node.js APIs are not available on mobile. Use a dynamic import() or require() guarded by Platform.isDesktop instead.
- **medium**: Unexpected use of 'localStorage'. Prefer `App#saveLocalStorage` / `App#loadLocalStorage` functions to write / read localStorage data that's unique to a vault.
- **medium**: Avoid :has — it can cause significant performance issues due to broad selector invalidation.
- **medium**: Do not import Node.js built-in module "node:http". Node.js APIs are not available on mobile. Use a dynamic import() or require() guarded by Platform.isDesktop instead.
- **medium**: Do not import Node.js built-in module "node:zlib". Node.js APIs are not available on mobile. Use a dynamic import() or require() guarded by Platform.isDesktop instead.
- **medium**: Use 'window.setTimeout()' instead of 'setTimeout()' for popout window compatibility.
- **medium**: Use '.instanceOf(HTMLInputElement)' instead of 'instanceof HTMLInputElement' for cross-window safe type checking.
- **medium**: Use '.instanceOf(HTMLTextAreaElement)' instead of 'instanceof HTMLTextAreaElement' for cross-window safe type checking.
- **medium**: Use '.instanceOf(HTMLSelectElement)' instead of 'instanceof HTMLSelectElement' for cross-window safe type checking.
- **medium**: Do not import Node.js built-in module "node:url". Node.js APIs are not available on mobile. Use a dynamic import() or require() guarded by Platform.isDesktop instead.
- **medium**: Unexpected browser feature "css-clip-path" is only partially supported by Obsidian 1.6.5
- **medium**: Avoid !important — override styles by increasing selector specificity or using CSS variables instead.
- **medium**: Unexpected browser feature "text-decoration" is only partially supported by Obsidian 1.6.5
- **medium**: Unexpected browser feature "extended-system-fonts" is not supported by Obsidian 1.6.5

### Emoji Search 0.1.0

- **medium**: This PluginSettingTab does not implement getSettingDefinitions(); its settings will not appear in Obsidian's settings search for users on 1.13.0 or later. Consider adopting the declarative settings API.
- **medium**: Unexpected browser feature "css-clip-path" is only partially supported by Obsidian 1.7.4

### Run Code Blocks 0.1.0

- **medium**: **Direct Filesystem Access**: Uses the Node.js `fs` module to access the filesystem outside of the Obsidian vault API. Can read and write any file on the system.
- **medium**: **Shell Execution**: Executes shell commands via `child_process`. Gives the plugin full control over the system.
- **medium**: This PluginSettingTab does not implement getSettingDefinitions(); its settings will not appear in Obsidian's settings search for users on 1.13.0 or later. Consider adopting the declarative settings API.
- **medium**: Avoid using 'globalThis'. Use 'window' or 'activeWindow' for popout window compatibility.

### Folder Index Notes 0.1.0

- **medium**: This PluginSettingTab does not implement getSettingDefinitions(); its settings will not appear in Obsidian's settings search for users on 1.13.0 or later. Consider adopting the declarative settings API.
