#!/usr/bin/env node
// Daily numbers for the WordPress plugins on wordpress.org: whether each slug
// is live, its version, active installs, downloads, rating, open support
// threads, and support topics opened in the last 7 days (for triage).
//
//   node wordpress/stats.mjs            # prints STATS.md to stdout
//   node wordpress/stats.mjs --write    # writes wordpress/STATS.md, updates history.csv
//
// Runs in GitHub Actions (.github/workflows/wp-stats.yml): Claude sessions
// cannot reach api.wordpress.org, runners can. Sessions read the committed
// STATS.md and history.csv. To track a new plugin, add its slug to plugins.json.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const API = 'https://api.wordpress.org/plugins/info/1.2/';
// A plugin that always exists, to tell "not listed" apart from "API broken".
const CONTROL = 'hello-dolly';

export function infoUrl(slug) {
	const q = new URLSearchParams({
		action: 'plugin_information',
		'request[slug]': slug,
		'request[fields][active_installs]': '1',
		'request[fields][sections]': '0',
		'request[fields][versions]': '0',
		'request[fields][screenshots]': '0',
		'request[fields][banners]': '0',
	});
	return `${API}?${q}`;
}

// The API answers 404 with {"error":"Plugin not found."} for unknown, pending
// and rejected slugs, and {"error":"closed", ...} for closed plugins.
export function parseInfo(slug, status, json) {
	if (json && json.error) {
		return { slug, live: false, state: json.error === 'closed' ? 'closed' : 'not listed' };
	}
	if (status !== 200 || !json || !json.slug) {
		return { slug, live: false, state: `API error ${status}` };
	}
	const open = (json.support_threads ?? 0) - (json.support_threads_resolved ?? 0);
	return {
		slug,
		live: true,
		state: 'live',
		name: json.name,
		version: json.version,
		installs: json.active_installs ?? 0,
		downloads: json.downloaded ?? 0,
		updated: String(json.last_updated ?? '').slice(0, 10),
		rating: json.num_ratings ? `${(json.rating / 20).toFixed(1)} (${json.num_ratings})` : 'none',
		openThreads: open,
	};
}

// wordpress.org/support/plugin/<slug>/feed/ is RSS 2.0; titles are CDATA.
export function parseFeed(xml, sinceMs) {
	const items = [];
	for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
		const get = (tag) => {
			const r = m[1].match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
			return r ? r[1].trim() : '';
		};
		const when = Date.parse(get('pubDate'));
		if (Number.isNaN(when) || when < sinceMs) continue;
		items.push({ title: get('title'), link: get('link'), date: new Date(when).toISOString().slice(0, 10) });
	}
	return items;
}

export function render(rows, topics, today) {
	const live = rows.filter((r) => r.live);
	const total = live.reduce((a, r) => a + r.installs, 0);
	const out = [
		'# WordPress plugins on wordpress.org',
		'',
		`Generated ${today} by \`.github/workflows/wp-stats.yml\` from api.wordpress.org. Active installs are wordpress.org's rounded buckets. "not listed" covers never submitted, pending review and rejected.`,
		'',
		`**Total active installs: ${total}** across ${live.length} live plugin${live.length === 1 ? '' : 's'}.`,
		'',
		'| Plugin | State | Version | Active installs | Downloads | Updated | Rating | Open threads |',
		'|---|---|---|---|---|---|---|---|',
		...rows.map((r) => r.live
			? `| [${r.slug}](https://wordpress.org/plugins/${r.slug}/) | live | ${r.version} | ${r.installs} | ${r.downloads} | ${r.updated} | ${r.rating} | ${r.openThreads} |`
			: `| ${r.slug} | ${r.state} | | | | | | |`),
		'',
		'## Support topics in the last 7 days',
		'',
	];
	if (!topics.length) out.push('None.');
	for (const t of topics) out.push(`- ${t.date} ${t.slug}: [${t.title}](${t.link})`);
	out.push('');
	return out.join('\n');
}

// One row per live plugin per day; re-running on the same day replaces that day.
export function updateHistory(csv, rows, today) {
	const header = 'date,slug,active_installs,downloads';
	const kept = csv.split('\n').filter((l) => l && l !== header && !l.startsWith(`${today},`));
	const add = rows.filter((r) => r.live).map((r) => `${today},${r.slug},${r.installs},${r.downloads}`);
	return [header, ...kept, ...add].join('\n') + '\n';
}

async function fetchInfo(slug) {
	const res = await fetch(infoUrl(slug), { headers: { 'User-Agent': 'morning-reports-wp-stats' } });
	let json = null;
	try { json = await res.json(); } catch { /* not JSON */ }
	return parseInfo(slug, res.status, json);
}

async function main() {
	const slugs = JSON.parse(fs.readFileSync(path.join(HERE, 'plugins.json'), 'utf8'));
	const control = await fetchInfo(CONTROL);
	if (!control.live) {
		console.error(`::error::Control plugin ${CONTROL} is ${control.state}; api.wordpress.org is not answering normally.`);
		process.exit(1);
	}
	const rows = [];
	const topics = [];
	const since = Date.now() - 7 * 86400e3;
	for (const slug of slugs) {
		const row = await fetchInfo(slug);
		rows.push(row);
		if (!row.live) continue;
		const res = await fetch(`https://wordpress.org/support/plugin/${slug}/feed/`);
		if (res.ok) topics.push(...parseFeed(await res.text(), since).map((t) => ({ ...t, slug })));
	}
	const today = new Date().toISOString().slice(0, 10);
	const md = render(rows, topics, today);
	console.log(md);
	if (process.argv.includes('--write')) {
		fs.writeFileSync(path.join(HERE, 'STATS.md'), md);
		const histPath = path.join(HERE, 'history.csv');
		const csv = fs.existsSync(histPath) ? fs.readFileSync(histPath, 'utf8') : '';
		fs.writeFileSync(histPath, updateHistory(csv, rows, today));
	}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	main().catch((e) => { console.error(e); process.exit(1); });
}
