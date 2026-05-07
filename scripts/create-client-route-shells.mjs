import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const serverRoutesPath = join(root, 'src/app/app.routes.server.ts');
const browserDistPath = join(root, 'dist/app/browser');
const csrShellPath = join(browserDistPath, 'index.csr.html');

const serverRoutes = await readFile(serverRoutesPath, 'utf8');
const manageRoutesMatch = serverRoutes.match(
	/const MANAGE_CLIENT_ROUTES = \[([\s\S]*?)\] satisfies string\[];/,
);

if (!manageRoutesMatch) {
	throw new Error('Could not find MANAGE_CLIENT_ROUTES in app.routes.server.ts.');
}

const manageRoutes = Array.from(manageRoutesMatch[1].matchAll(/'([^']+)'/g), (match) => match[1]);

await Promise.all(
	manageRoutes.map(async (route) => {
		const outputPath = join(browserDistPath, route, 'index.html');

		await mkdir(dirname(outputPath), { recursive: true });
		await copyFile(csrShellPath, outputPath);
	}),
);

console.log(`Created ${manageRoutes.length} client route shells for GitHub Pages.`);
