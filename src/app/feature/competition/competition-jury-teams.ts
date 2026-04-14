export type CompetitionJudgeView = {
	name: string;
	photo: string;
	description: string;
};

export type CompetitionTeamMemberView = {
	displayName: string;
	subtitle: string;
	note: string;
	projects: { name: string; url: string }[];
};

export type CompetitionTeamView = {
	id: string;
	name: string;
	framework: string;
	qa: string;
	themeRepo: string;
	themeRepoUrl: string;
	themeWebsiteUrl: string;
	description: string;
	highlights: string[];
	members: CompetitionTeamMemberView[];
};

function _s(value: unknown) {
	return typeof value === 'string' ? value.trim() : '';
}

function _resolvePhotoUrl(photo: string) {
	const p = photo.trim();
	if (!p) {
		return '';
	}
	if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('/')) {
		return p;
	}
	return `/${p}`;
}

function _normalizeProjects(raw: unknown): { name: string; url: string }[] {
	if (!Array.isArray(raw)) {
		return [];
	}
	const out: { name: string; url: string }[] = [];
	for (const item of raw) {
		if (!item || typeof item !== 'object') {
			continue;
		}
		const o = item as Record<string, unknown>;
		const name = _s(o['name']);
		const url = _s(o['url']);
		if (name && url) {
			out.push({ name, url });
		}
	}
	return out;
}

export function normalizeCompetitionJudges(raw: unknown): CompetitionJudgeView[] {
	if (!Array.isArray(raw)) {
		return [];
	}
	const out: CompetitionJudgeView[] = [];
	for (const item of raw) {
		if (!item || typeof item !== 'object') {
			continue;
		}
		const o = item as Record<string, unknown>;
		const name = _s(o['name']) || 'Член журі';
		const photo = _resolvePhotoUrl(_s(o['photo']));
		const description = _s(o['description']);
		out.push({ name, photo, description });
	}
	return out;
}

function _normalizeMember(entry: unknown, index: number): CompetitionTeamMemberView {
	if (typeof entry === 'string') {
		const displayName = entry.trim() || `Учасник ${index + 1}`;
		return { displayName, subtitle: '', note: '', projects: [] };
	}
	if (!entry || typeof entry !== 'object') {
		return { displayName: `Учасник ${index + 1}`, subtitle: '', note: '', projects: [] };
	}
	const o = entry as Record<string, unknown>;
	const username = _s(o['username']);
	const name = _s(o['name']);
	const fullName = _s(o['fullName']);
	const displayName = username || fullName || name || `Учасник ${index + 1}`;
	let subtitle = '';
	if (fullName && fullName !== displayName) {
		subtitle = fullName;
	} else if (name && name !== displayName) {
		subtitle = name;
	} else if (username && fullName && username !== fullName) {
		subtitle = fullName;
	}
	const note = _s(o['note']);
	const projects = _normalizeProjects(o['projects']);
	return {
		displayName,
		subtitle,
		note,
		projects,
	};
}

export function normalizeCompetitionTeams(raw: unknown): CompetitionTeamView[] {
	if (!Array.isArray(raw)) {
		return [];
	}
	const out: CompetitionTeamView[] = [];
	for (let i = 0; i < raw.length; i++) {
		const item = raw[i];
		if (!item || typeof item !== 'object') {
			continue;
		}
		const o = item as Record<string, unknown>;
		const id = _s(o['id']) || `team-${i}`;
		const name = _s(o['name']) || `Команда ${i + 1}`;
		const framework = _s(o['framework']);
		const qa = _s(o['qa']);
		const themeRepo = _s(o['themeRepo']);
		const themeRepoUrl = _s(o['themeRepoUrl']);
		const themeWebsiteUrl = _s(o['themeWebsiteUrl']);
		const description = _s(o['description']);
		let highlights: string[] = [];
		if (Array.isArray(o['highlights'])) {
			highlights = o['highlights'].map((h) => String(h).trim()).filter(Boolean);
		}
		const membersRaw = o['members'] ?? o['developers'];
		let members: CompetitionTeamMemberView[] = [];
		if (Array.isArray(membersRaw)) {
			members = membersRaw.map((m, idx) => _normalizeMember(m, idx));
		}
		out.push({
			id,
			name,
			framework,
			qa,
			themeRepo,
			themeRepoUrl,
			themeWebsiteUrl,
			description,
			highlights,
			members,
		});
	}
	return out;
}
