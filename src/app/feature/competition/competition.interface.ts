/**
 * Вміст документа змагання з API (`data: { ... }`).
 * Індексний підпис дозволяє довільні поля від бекенду; перелічені ключі — те, що використовує UI.
 */
export interface CompetitionData {
	title?: string;
	name?: string;
	description?: string;
	summary?: string;
	about?: string;
	season?: string;
	year?: string;
	format?: string;
	mode?: string;
	period?: string;
	deadline?: string;
	date?: string;
	registrationDeadline?: string;
	prize?: string;
	reward?: string;
	voting?: string;
	vote?: string;
	submission?: string;
	submissions?: string;
	tags?: string[];
	stack?: string[];
	topics?: string[];
	active?: boolean;
	status?: string;
	published?: boolean;
	stages?: string[];
	timeline?: string[];
	steps?: string[];
	roadmap?: string[];
	requirements?: string[];
	criteria?: string[];
	conditions?: string[];
	rules?: string[];
	benefits?: string[];
	highlights?: string[];
	outcomes?: string[];
	whatYouGet?: string[];
	location?: string;
	place?: string;
	venue?: string;
	participants?: string | number;
	teamsCount?: number;
	membersCount?: number;
	maxTeams?: string | number;
	teamsLimit?: string | number;
	teamSize?: string | number;
	membersPerTeam?: string | number;
	sponsors?: string[];
	partners?: string[];
	supporters?: string[];
	judges?: unknown[];
	jury?: unknown[];
	teams?: unknown[];
	judgesSubtitle?: string;
	jurySubtitle?: string;
	teamsSubtitle?: string;
	[key: string]: unknown;
}

export interface Competition {
	_id: string;
	data: CompetitionData;
}
