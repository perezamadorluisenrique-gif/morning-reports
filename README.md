# morning-reports
Daily autopilot reports for the Obsidian plugins, opened as issues.

## Directory status

`.github/workflows/directorio.yml` runs daily (and on dispatch), reads each plugin's public listing on community.obsidian.md and commits [ESTADO.md](ESTADO.md): the release on GitHub, the version the directory serves, the review result and what to do. It moved here from the private workshop repo because public repos' Actions minutes are free. To watch a new plugin, add its repo to `PLUGINS` in `directory/estado.mjs`.

## WordPress stats

`.github/workflows/wp-stats.yml` runs daily at 11:23 UTC (and on dispatch). It reads each slug in `wordpress/plugins.json` from api.wordpress.org and its support feed, and commits [wordpress/STATS.md](wordpress/STATS.md) (live or not, version, active installs, downloads, rating, open threads, support topics from the last 7 days) and `wordpress/history.csv` (one row per live plugin per day). Claude sessions can't reach api.wordpress.org; Actions can. The WordPress project's morning report runs at 11:45 UTC and reads these files. To track a new plugin, add its slug to `wordpress/plugins.json`.
