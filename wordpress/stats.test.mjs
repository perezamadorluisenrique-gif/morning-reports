import { test } from 'node:test';
import assert from 'node:assert/strict';
import { infoUrl, parseFeed, parseInfo, render, updateHistory } from './stats.mjs';

test('infoUrl asks for active installs', () => {
	const u = new URL(infoUrl('child-theme-maker'));
	assert.equal(u.searchParams.get('request[slug]'), 'child-theme-maker');
	assert.equal(u.searchParams.get('request[fields][active_installs]'), '1');
});

test('parseInfo reads a live plugin', () => {
	const r = parseInfo('x', 200, { slug: 'x', name: 'X', version: '1.0.1', active_installs: 200, downloaded: 1234, last_updated: '2026-10-20 3:00pm GMT', rating: 90, num_ratings: 4, support_threads: 3, support_threads_resolved: 1 });
	assert.deepEqual(r, { slug: 'x', live: true, state: 'live', name: 'X', version: '1.0.1', installs: 200, downloads: 1234, updated: '2026-10-20', rating: '4.5 (4)', openThreads: 2 });
});

test('parseInfo tells not listed, closed and API errors apart', () => {
	assert.equal(parseInfo('x', 404, { error: 'Plugin not found.' }).state, 'not listed');
	assert.equal(parseInfo('x', 404, { error: 'closed', name: 'X' }).state, 'closed');
	assert.equal(parseInfo('x', 502, null).state, 'API error 502');
});

test('parseFeed keeps recent items only', () => {
	const xml = `<rss><channel>
<item><title><![CDATA[Toolbar hides on mobile]]></title><link>https://wordpress.org/support/topic/a/</link><pubDate>Mon, 19 Oct 2026 10:00:00 +0000</pubDate></item>
<item><title>Old one</title><link>https://wordpress.org/support/topic/b/</link><pubDate>Mon, 01 Jun 2026 10:00:00 +0000</pubDate></item>
</channel></rss>`;
	const items = parseFeed(xml, Date.parse('2026-10-12T00:00:00Z'));
	assert.deepEqual(items, [{ title: 'Toolbar hides on mobile', link: 'https://wordpress.org/support/topic/a/', date: '2026-10-19' }]);
});

test('render sums live installs only', () => {
	const md = render([
		{ slug: 'a', live: true, version: '1.0.0', installs: 100, downloads: 5, updated: '2026-10-01', rating: 'none', openThreads: 0 },
		{ slug: 'b', live: false, state: 'not listed' },
	], [], '2026-10-20');
	assert.match(md, /Total active installs: 100\*\* across 1 live plugin\./);
	assert.match(md, /\| b \| not listed \|/);
	assert.match(md, /None\./);
});

test('updateHistory replaces today and keeps earlier days', () => {
	const before = 'date,slug,active_installs,downloads\n2026-10-19,a,10,50\n2026-10-20,a,10,60\n';
	const after = updateHistory(before, [{ slug: 'a', live: true, installs: 20, downloads: 70 }, { slug: 'b', live: false }], '2026-10-20');
	assert.equal(after, 'date,slug,active_installs,downloads\n2026-10-19,a,10,50\n2026-10-20,a,20,70\n');
});
