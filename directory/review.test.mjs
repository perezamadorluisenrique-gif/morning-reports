import { test } from 'node:test';
import assert from 'node:assert/strict';
import { notListedReport, parseFeed, parseListing, passed, report, rscText, waitFor } from './review.mjs';

// Trozos con la forma exacta de community.obsidian.md el 2026-09-27: el
// contenido va como cadenas JSON dentro de self.__next_f.push([1,"..."]).
function page(chunks) {
	return '<html><body>' + chunks.map((c) => `<script>self.__next_f.push([1,${JSON.stringify(c)}])</script>`).join('') + '</body></html>';
}

const risks = page([
	'1:["$","div",null,{"className":"text-muted","children":"Current version"}],["$","div",null,{"className":"","children":"0.1.0"}]',
	'2:[["$","span",null,{"className":"text-muted group-hover:text-normal","children":"Review"}],["$","span",null,{"className":"text-red-400","children":"Risks"}]]',
	'3:["$","div",null,{"className":"text-sm mb-4","children":"12 issues found by automated scans of the latest release."}]',
	'4:[["$","div","high:0:Uses Obsidian APIs newer than the declared `minAppVersion`",{}],["$","div","medium:0:Use \'.instanceOf(Text)\' instead of \'instanceof Text\' for cross-window safe type checking.",{}]]',
	'5:[["$","div","pass:0:The `main.js` release asset has a verified GitHub artifact attestation.",{}],["$","div","info:0:Malware scan not available.",{}]]',
	// El mismo hallazgo sale dos veces en la página (barra lateral y pestaña).
	'6:[["$","div","high:0:Uses Obsidian APIs newer than the declared `minAppVersion`",{}]]',
]);

const clean = page([
	'1:["$","div",null,{"className":"text-muted","children":"Current version"}],["$","div",null,{"className":"","children":"0.3.0"}]',
	'2:[["$","span",null,{"className":"text-muted group-hover:text-normal","children":"Review"}],["$","span",null,{"className":"text-green-400","children":"Passed"}]]',
	'3:["$","div",null,{"className":"text-sm mb-4","children":"No issues found by automated scans of the latest release."}]',
	'4:[["$","div","pass:0:Build reproduced the release main.js byte-for-byte",{}],["$","div","info:0:Malware scan not available.",{}]]',
]);

test('rscText une los trozos decodificados', () => {
	assert.equal(rscText(page(['a"b', 'c'])), 'a"bc');
});

test('una ficha con un hallazgo alto no pasa', () => {
	const l = parseListing(risks);
	assert.equal(l.currentVersion, '0.1.0');
	assert.equal(l.review, 'Risks');
	assert.equal(l.summary, '12 issues found by automated scans of the latest release.');
	assert.deepEqual(l.findings.map((f) => f.severity), ['high', 'medium', 'info', 'pass']);
	assert.equal(passed(l), false);
});

test('una ficha limpia pasa', () => {
	const l = parseListing(clean);
	assert.equal(l.currentVersion, '0.3.0');
	assert.equal(l.review, 'Passed');
	assert.equal(passed(l), true);
});

test('Satisfactory con un hallazgo medio pasa; Passed con uno alto no', () => {
	assert.equal(passed({ review: 'Satisfactory', findings: [{ severity: 'medium', message: 'x' }] }), true);
	assert.equal(passed({ review: 'Passed', findings: [{ severity: 'high', message: 'x' }] }), false);
	assert.equal(passed({ review: null, findings: [] }), false);
});

test('también lee el HTML ya pintado si no hay trozos RSC', () => {
	const html = '<div class="text-muted">Current version</div><div class="">0.2.0</div>'
		+ '<span class="text-muted">Review</span><span class="text-green-400">Passed</span>';
	const l = parseListing(html);
	assert.equal(l.currentVersion, '0.2.0');
	assert.equal(l.review, 'Passed');
});

test('parseFeed saca las versiones del feed de releases', () => {
	const xml = '<item><title>Shared Blocks 0.4.1</title><guid isPermaLink="false">release:plugin:shared-blocks:0.4.1</guid></item>'
		+ '<item><guid isPermaLink="false">release:plugin:shared-blocks:0.4.0</guid></item>';
	assert.deepEqual(parseFeed(xml), ['0.4.1', '0.4.0']);
});

test('el informe no lista los pass y avisa de la versión que falta', () => {
	const text = report('list-item-callouts', parseListing(risks), { waitedFor: '0.1.1', note: 'Pulsa Check for new releases.' });
	assert.match(text, /0\.1\.0 \(waiting for 0\.1\.1\)/);
	assert.match(text, /\*\*high\*\*: Uses Obsidian APIs/);
	assert.doesNotMatch(text, /attestation/);
	assert.match(text, /Check for new releases/);
});

test('estado: una fila por plugin con la acción que toca', async () => {
	const { accion, fila } = await import('./estado.mjs');
	const bien = { id: 'x', nombre: 'X', main: '0.3.0', release: '0.3.0', directorio: '0.3.0', listing: parseListing(clean) };
	assert.equal(accion(bien), '');
	assert.match(fila(bien), /\| 0\.3\.0 \| 0\.3\.0 \| Passed \| ninguno \| nada \|$/);
	const atras = { id: 'y', nombre: 'Y', main: '0.1.1', release: '0.1.1', directorio: '0.1.0', listing: parseListing(risks) };
	const a = accion(atras);
	assert.match(a, /sigue en 0\.1\.0: dashboard → … → Check for new releases/);
	assert.match(a, /revisión Risks: high, Uses Obsidian APIs/);
	assert.match(fila(atras), /1 high, 1 medium/);
	assert.match(accion({ ...bien, main: '0.3.1' }), /main dice 0\.3\.1 y no hay release/);
});

test('un plugin sin ficha (404) deja de esperar tras tres lecturas y no cuenta como fallo', async () => {
	const real = globalThis.fetch;
	let calls = 0;
	globalThis.fetch = async () => {
		calls++;
		return new Response('not found', { status: 404 });
	};
	try {
		const r = await waitFor('nuevo', '0.1.0', { every: 0.00001, timeout: 5 });
		assert.equal(r.notListed, true);
		assert.equal(r.listing, null);
		// Cada lectura pide la ficha y el feed; tres 404 seguidos bastan.
		assert.ok(calls >= 3 && calls <= 6);
	} finally {
		globalThis.fetch = real;
	}
});

test('un 404 suelto de un plugin ya listado no lo da por no listado', async () => {
	const real = globalThis.fetch;
	let round = 0;
	globalThis.fetch = async (url) => {
		const feed = String(url).endsWith('feed.xml');
		// La primera lectura falla (404 en la ficha); las siguientes van bien.
		if (round === 0 && !feed) {
			round++;
			return new Response('nope', { status: 404 });
		}
		return new Response(feed ? '<guid>release:plugin:x:0.3.0</guid>' : clean, { status: 200 });
	};
	try {
		const r = await waitFor('x', '0.3.0', { every: 0.00001, timeout: 5, settle: 0 });
		assert.notEqual(r.notListed, true);
		assert.equal(r.listing.review, 'Passed');
	} finally {
		globalThis.fetch = real;
	}
});

test('el informe de no listado dice cómo listarlo', () => {
	const text = notListedReport('note-reading-time');
	assert.match(text, /not in the directory yet/);
	assert.match(text, /submit this repository/);
});

test('estado: los hallazgos medios salen con su texto', async () => {
	const { detalle, tabla } = await import('./estado.mjs');
	const p = { nombre: 'X', directorio: '0.1.0', listing: { findings: [{ severity: 'medium', message: 'Avoid inline styles' }, { severity: 'pass', message: 'ok' }] } };
	assert.deepEqual(detalle(p), ['### X 0.1.0', '', '- **medium**: Avoid inline styles', '']);
	assert.deepEqual(detalle({ nombre: 'Y', listing: null }), []);
	assert.match(tabla(['| f |'], detalle(p)), /## Hallazgos\n\n### X 0\.1\.0\n\n- \*\*medium\*\*: Avoid inline styles/);
	assert.doesNotMatch(tabla(['| f |']), /Hallazgos\n/);
});
