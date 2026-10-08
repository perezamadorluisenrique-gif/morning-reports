#!/usr/bin/env node
// Estado de los plugins publicados en el directorio de Obsidian, uno por fila:
// el último release de GitHub, la versión que sirve el directorio, el
// resultado de su revisión automática y qué hacer si algo no cuadra.
//
//   node directory/estado.mjs                 # imprime la tabla
//   node directory/estado.mjs --write         # además escribe ESTADO.md
//
// Solo corre en GitHub Actions (.github/workflows/directorio.yml, a diario y
// a mano): las sesiones de Claude no llegan a community.obsidian.md. Una
// sesión lo lanza con actions_run_trigger y lee el resultado en ESTADO.md o
// en el resumen del job.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Plugin repos watched, same list as tools/sync-public/sync.mjs in obsidian-dev
// (private, so this repo carries its own copy; add a new plugin's repo here).
export const OWNER = 'perezamadorluisenrique-gif';
export const PLUGINS = ['shared-blocks', 'text-format', 'smart-typography-plugin', 'section-numbering', 'spreadsheet-to-table', 'hybrid-line-numbers', 'list-item-callouts', 'folder-counts', 'note-reading-time', 'task-rollover', 'zoom-into-section', 'link-title-on-paste', 'community-update-checker', 'dataview-to-bases', 'line-editing-commands', 'note-mover-rules', 'tab-history', 'url-cards', 'vim-config', 'task-archive'].map((repo) => ({ repo }));
import { passed, read, SITE } from './review.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));

// Qué hacer, en una frase, o '' si todo cuadra.
export function accion({ release, main, directorio, listing }) {
	const cosas = [];
	if (main && release && main !== release) cosas.push(`main dice ${main} y no hay release: fusionar o lanzar Release`);
	if (release && directorio && directorio !== release) cosas.push(`el directorio sigue en ${directorio}: dashboard → … → Check for new releases`);
	if (listing && !passed(listing)) {
		const peor = listing.findings.find((f) => f.severity !== 'pass' && f.severity !== 'info');
		cosas.push(`revisión ${listing.review ?? 'sin resultado'}${peor ? `: ${peor.severity}, ${peor.message}` : ''}`);
	}
	return cosas.join('; ');
}

export function fila(p) {
	const hallazgos = p.listing
		? p.listing.findings.filter((f) => f.severity !== 'pass' && f.severity !== 'info').map((f) => f.severity)
		: [];
	const cuenta = hallazgos.length
		? Object.entries(hallazgos.reduce((a, s) => ({ ...a, [s]: (a[s] ?? 0) + 1 }), {})).map(([s, n]) => `${n} ${s}`).join(', ')
		: 'ninguno';
	return `| [${p.nombre}](${SITE}/plugins/${p.id}) | ${p.release ?? '?'} | ${p.directorio ?? '?'} | ${p.listing?.review ?? '?'} | ${cuenta} | ${accion(p) || 'nada'} |`;
}

// Texto de cada hallazgo que no es pass ni info, para poder arreglarlo sin
// abrir la ficha (las sesiones no llegan a community.obsidian.md).
export function detalle(p) {
	const malos = (p.listing?.findings ?? []).filter((f) => f.severity !== 'pass' && f.severity !== 'info');
	if (!malos.length) return [];
	return [`### ${p.nombre} ${p.directorio ?? ''}`.trimEnd(), '', ...malos.map((f) => `- **${f.severity}**: ${f.message}`), ''];
}

export function tabla(filas, detalles = []) {
	return [
		'# Estado en el directorio de Obsidian',
		'',
		'Generado por `.github/workflows/directorio.yml` con `directory/estado.mjs`. Hallazgos: los que no son `pass` ni `info` en la ficha pública.',
		'',
		'| Plugin | Release en GitHub | Directorio | Revisión | Hallazgos | Qué hacer |',
		'|---|---|---|---|---|---|',
		...filas,
		'',
		...(detalles.length ? ['## Hallazgos', '', ...detalles] : []),
	].join('\n');
}

async function json(url) {
	const headers = { accept: 'application/vnd.github+json' };
	if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`${url}: ${res.status}`);
	return res.json();
}

async function uno({ repo }) {
	const manifest = await json(`https://api.github.com/repos/${OWNER}/${repo}/contents/manifest.json?ref=main`)
		.then((r) => JSON.parse(Buffer.from(r.content, 'base64').toString('utf8')));
	const release = await json(`https://api.github.com/repos/${OWNER}/${repo}/releases/latest`).then((r) => r.tag_name, () => null);
	let listing = null;
	try {
		({ listing } = await read(manifest.id));
	} catch (err) {
		console.error(`${manifest.id}: ${err.message}`);
	}
	return { id: manifest.id, nombre: manifest.name, main: manifest.version, release, directorio: listing?.currentVersion ?? null, listing };
}

async function main(args) {
	const filas = [];
	const detalles = [];
	let algo = false;
	for (const p of PLUGINS) {
		const datos = await uno(p);
		if (accion(datos)) algo = true;
		filas.push(fila(datos));
		detalles.push(...detalle(datos));
	}
	const texto = tabla(filas, detalles);
	console.log(texto);
	if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, texto);
	if (args.includes('--write')) fs.writeFileSync(path.join(AQUI, '..', 'ESTADO.md'), texto);
	if (algo) console.log('Hay plugins con algo pendiente (columna «Qué hacer»).');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await main(process.argv.slice(2));
