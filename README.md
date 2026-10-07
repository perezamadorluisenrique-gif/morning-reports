# morning-reports
Daily autopilot reports for the Obsidian plugins, opened as issues.

## Directory status

`.github/workflows/directorio.yml` runs daily (and on dispatch), reads each plugin's public listing on community.obsidian.md and commits [ESTADO.md](ESTADO.md): the release on GitHub, the version the directory serves, the review result and what to do. It moved here from the private workshop repo because public repos' Actions minutes are free. To watch a new plugin, add its repo to `PLUGINS` in `directory/estado.mjs`.
