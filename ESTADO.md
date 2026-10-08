# Estado en el directorio de Obsidian

Generado por `.github/workflows/directorio.yml` con `directory/estado.mjs`. Hallazgos: los que no son `pass` ni `info` en la ficha pública.

| Plugin | Release en GitHub | Directorio | Revisión | Hallazgos | Qué hacer |
|---|---|---|---|---|---|
| [Shared Blocks](https://community.obsidian.md/plugins/shared-blocks) | 0.4.1 | 0.4.1 | Passed | ninguno | nada |
| [Text Case and Cleanup](https://community.obsidian.md/plugins/text-format) | 0.5.0 | 0.5.0 | Passed | ninguno | nada |
| [Typography as You Type](https://community.obsidian.md/plugins/typography-as-you-type) | 0.5.0 | 0.5.0 | Passed | ninguno | nada |
| [Section Numbering](https://community.obsidian.md/plugins/section-numbering) | 0.6.0 | 0.5.0 | Passed | ninguno | el directorio sigue en 0.5.0: dashboard → … → Check for new releases |
| [Spreadsheet to Table](https://community.obsidian.md/plugins/spreadsheet-to-table) | 0.4.0 | 0.4.0 | Passed | ninguno | nada |
| [Hybrid Line Numbers](https://community.obsidian.md/plugins/hybrid-line-numbers) | 0.2.2 | 0.2.1 | Passed | ninguno | el directorio sigue en 0.2.1: dashboard → … → Check for new releases |
| [List Item Callouts](https://community.obsidian.md/plugins/list-item-callouts) | 0.1.1 | 0.1.1 | Passed | ninguno | nada |
| [Folder Counts](https://community.obsidian.md/plugins/folder-counts) | 0.1.0 | 0.1.0 | Passed | ninguno | nada |
| [Note Reading Time](https://community.obsidian.md/plugins/note-reading-time) | 0.1.0 | 0.1.0 | Passed | ninguno | nada |
| [Task Rollover](https://community.obsidian.md/plugins/task-rollover) | 0.1.1 | 0.1.1 | Passed | ninguno | nada |
| [Zoom Into Section](https://community.obsidian.md/plugins/zoom-into-section) | 0.1.2 | 0.1.2 | Passed | ninguno | nada |
| [Link Title on Paste](https://community.obsidian.md/plugins/link-title-on-paste) | 0.1.1 | 0.1.0 | Satisfactory | 1 medium | el directorio sigue en 0.1.0: dashboard → … → Check for new releases |
| [Update Radar](https://community.obsidian.md/plugins/update-radar) | 0.1.3 | 0.1.3 | Passed | ninguno | nada |
| [Dataview to Bases](https://community.obsidian.md/plugins/dataview-to-bases) | 0.1.1 | 0.1.0 | Satisfactory | 1 medium | el directorio sigue en 0.1.0: dashboard → … → Check for new releases |
| [Line Editing Commands](https://community.obsidian.md/plugins/line-editing-commands) | 0.1.1 | 0.1.1 | Passed | ninguno | nada |
| [Note Mover Rules](https://community.obsidian.md/plugins/note-mover-rules) | 0.1.0 | 0.1.0 | Passed | ninguno | nada |
| [Tab History](https://community.obsidian.md/plugins/tab-history) | 0.2.0 | 0.1.0 | Satisfactory | 1 medium | el directorio sigue en 0.1.0: dashboard → … → Check for new releases |
| [URL Cards](https://community.obsidian.md/plugins/url-cards) | 0.1.0 | 0.1.0 | Passed | ninguno | nada |
| [Vim Config](https://community.obsidian.md/plugins/vim-config) | 0.1.0 | 0.1.0 | Passed | ninguno | nada |
| [Task Archive](https://community.obsidian.md/plugins/task-archive) | 0.1.0 | ? | ? | ninguno | nada |
| [Review Later](https://community.obsidian.md/plugins/review-later) | 0.1.0 | ? | ? | ninguno | nada |
| [File Tree Colors](https://community.obsidian.md/plugins/file-tree-colors) | 0.1.0 | ? | ? | ninguno | nada |
| [Book Notes](https://community.obsidian.md/plugins/book-notes) | 0.1.0 | ? | ? | ninguno | nada |

## Hallazgos

### Link Title on Paste 0.1.0

- **medium**: This PluginSettingTab does not implement getSettingDefinitions(); its settings will not appear in Obsidian's settings search for users on 1.13.0 or later. Consider adopting the declarative settings API.

### Dataview to Bases 0.1.0

- **medium**: This PluginSettingTab does not implement getSettingDefinitions(); its settings will not appear in Obsidian's settings search for users on 1.13.0 or later. Consider adopting the declarative settings API.

### Tab History 0.1.0

- **medium**: Avoid !important — override styles by increasing selector specificity or using CSS variables instead.
