import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
	normalizeCompetitionJudges,
	normalizeCompetitionTeams,
	type CompetitionJudgeView,
	type CompetitionTeamView,
} from '../../competition-jury-teams';
import { Competition, CompetitionData } from '../../competition.interface';
import { CompetitionService } from '../../competition.service';

@Component({
	selector: 'app-competition',
	imports: [RouterLink],
	templateUrl: './competition.component.html',
	styleUrl: './competition.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetitionComponent implements OnInit {
	private readonly _route = inject(ActivatedRoute);
	private readonly _competitionService = inject(CompetitionService);

	protected readonly isLoading = signal(true);
	protected readonly competition = signal<Competition | null>(null);

	protected readonly title = computed(() => {
		const current = this.competition();
		if (!current) {
			return '';
		}

		return this._competitionService.getTitle(current);
	});
	protected readonly description = computed(() => {
		const current = this.competition();
		if (!current) {
			return '';
		}

		return (
			this._pickString(current.data, ['description', 'summary', 'about']) ||
			'Опис змагання буде додано найближчим часом.'
		);
	});
	protected readonly metaCards = computed(() => {
		const current = this.competition();
		if (!current) {
			return [];
		}

		return [
			{ label: 'Сезон', value: this._pickString(current.data, ['season', 'year']) },
			{ label: 'Формат', value: this._pickString(current.data, ['format', 'mode']) },
			{ label: 'Період', value: this._pickString(current.data, ['period', 'deadline', 'date']) },
			{ label: 'Приз', value: this._pickString(current.data, ['prize', 'reward']) },
			{ label: 'Голосування', value: this._pickString(current.data, ['voting', 'vote']) },
			{ label: 'Подання робіт', value: this._pickString(current.data, ['submission', 'submissions']) },
		].filter((card) => card.value);
	});
	protected readonly tags = computed(() => {
		const current = this.competition();
		if (!current) {
			return [];
		}

		return this._pickStringArray(current.data, ['tags', 'stack', 'topics']);
	});
	protected readonly location = computed(() => {
		const current = this.competition();
		if (!current) {
			return '';
		}

		return this._pickString(current.data, ['location', 'place', 'venue']);
	});
	protected readonly sponsors = computed(() => {
		const current = this.competition();
		if (!current) {
			return [];
		}

		return this._pickStringArray(current.data, ['sponsors', 'partners', 'supporters']);
	});
	protected readonly judgesSubtitle = computed(() => {
		const current = this.competition();
		if (!current) {
			return 'Експертна комісія фінального перегляду';
		}
		return (
			this._pickString(current.data, ['judgesSubtitle', 'jurySubtitle']) ||
			'Експертна комісія фінального перегляду'
		);
	});
	protected readonly teamsSubtitle = computed(() => {
		const current = this.competition();
		if (!current) {
			return 'Склад команд і проєкти, які вони ведуть у межах практики';
		}
		return (
			this._pickString(current.data, ['teamsSubtitle']) ||
			'Склад команд і проєкти, які вони ведуть у межах практики'
		);
	});
	protected readonly judges = computed((): CompetitionJudgeView[] => {
		const current = this.competition();
		if (!current) {
			return [];
		}
		const raw = current.data['judges'] ?? current.data['jury'];
		return normalizeCompetitionJudges(raw);
	});
	protected readonly teams = computed((): CompetitionTeamView[] => {
		const current = this.competition();
		if (!current) {
			return [];
		}
		return normalizeCompetitionTeams(current.data['teams']);
	});
	protected readonly teamsCount = computed(() => this.teams().length);
	protected readonly participantsCount = computed(() =>
		this.teams().reduce((sum, team) => sum + team.members.length, 0),
	);
	protected readonly stages = computed(() => {
		const current = this.competition();
		if (!current) {
			return [];
		}

		const direct = this._pickStringList(current.data, ['stages', 'timeline', 'steps', 'roadmap']);
		if (direct.length) {
			return direct;
		}

		const period = this._pickString(current.data, ['period', 'deadline', 'date']);
		if (period) {
			return ['Реєстрація та відбір', 'Розробка рішення', `Фінал (${period})`];
		}

		return ['Реєстрація', 'Розробка', 'Фінальна презентація'];
	});
	protected readonly requirements = computed(() => {
		const current = this.competition();
		if (!current) {
			return [];
		}

		const direct = this._pickStringList(current.data, [
			'requirements',
			'criteria',
			'conditions',
			'rules',
		]);
		if (direct.length) {
			return direct;
		}

		return [
			'Наявність команди або готовність працювати в команді',
			'Дотримання дедлайнів подання матеріалів',
			'Презентація рішення у фіналі',
		];
	});
	protected readonly benefits = computed(() => {
		const current = this.competition();
		if (!current) {
			return [];
		}

		const direct = this._pickStringList(current.data, ['benefits', 'highlights', 'outcomes', 'whatYouGet']);
		if (direct.length) {
			return direct;
		}

		const prize = this._pickString(current.data, ['prize', 'reward']);
		const fallback = ['Практичний досвід у реальному кейсі', 'Нетворкінг з учасниками та менторами'];
		if (prize) {
			fallback.unshift(`Можливість отримати приз: ${prize}`);
		}

		return fallback;
	});
	protected readonly heroStats = computed(() => {
		const current = this.competition();
		if (!current) {
			return [];
		}

		return [
			{ label: 'Сезон', value: this._pickString(current.data, ['season', 'year']) },
			{ label: 'Формат', value: this._pickString(current.data, ['format', 'mode']) },
			{ label: 'Період', value: this._pickString(current.data, ['period', 'deadline', 'date']) },
			{ label: 'Приз', value: this._pickString(current.data, ['prize', 'reward']) },
			{ label: 'Команд', value: this.teamsCount() ? String(this.teamsCount()) : '' },
			{ label: 'Учасників', value: this.participantsCount() ? String(this.participantsCount()) : '' },
		].filter((item) => item.value);
	});
	protected readonly extraEntries = computed(() => {
		const current = this.competition();
		if (!current) {
			return [];
		}

		const hiddenKeys = new Set([
			'title',
			'name',
			'description',
			'summary',
			'about',
			'season',
			'year',
			'format',
			'mode',
			'period',
			'deadline',
			'date',
			'prize',
			'reward',
			'voting',
			'vote',
			'submission',
			'submissions',
			'tags',
			'stack',
			'topics',
			'active',
			'status',
			'stages',
			'timeline',
			'steps',
			'roadmap',
			'requirements',
			'criteria',
			'conditions',
			'rules',
			'benefits',
			'highlights',
			'outcomes',
			'whatYouGet',
			'location',
			'place',
			'venue',
			'sponsors',
			'partners',
			'supporters',
			'participants',
			'teamsCount',
			'membersCount',
			'maxTeams',
			'teamsLimit',
			'teamSize',
			'membersPerTeam',
			'judges',
			'jury',
			'teams',
			'judgesSubtitle',
			'jurySubtitle',
			'teamsSubtitle',
		]);

		return Object.entries(current.data)
			.filter(([key, value]) => !hiddenKeys.has(key) && value !== '' && value !== null)
			.map(([key, value]) => ({
				key: this._prettyKey(key),
				value: this._formatValue(value),
			}));
	});

	async ngOnInit() {
		const id = this._route.snapshot.paramMap.get('id');
		if (!id) {
			this.isLoading.set(false);
			return;
		}

		this.competition.set(await this._competitionService.fetchById(id));
		this.isLoading.set(false);
	}

	private _pickString(data: CompetitionData, keys: (keyof CompetitionData)[]) {
		for (const key of keys) {
			const value = data[key];
			if (typeof value === 'string' && value.trim()) {
				return value.trim();
			}
		}

		return '';
	}

	private _pickStringArray(data: CompetitionData, keys: (keyof CompetitionData)[]) {
		for (const key of keys) {
			const value = data[key];
			if (Array.isArray(value)) {
				return value.map((item) => String(item)).filter((item) => item.trim());
			}
		}

		return [];
	}

	private _pickNumber(data: CompetitionData, keys: (keyof CompetitionData)[]) {
		for (const key of keys) {
			const value = data[key];
			if (typeof value === 'number' && Number.isFinite(value)) {
				return value;
			}

			if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
				return Number(value);
			}
		}

		return null;
	}

	private _pickStringList(data: CompetitionData, keys: (keyof CompetitionData)[]) {
		for (const key of keys) {
			const value = data[key];
			if (Array.isArray(value)) {
				return value.map((item) => String(item).trim()).filter((item) => item);
			}

			if (typeof value === 'string' && value.trim()) {
				return value
					.split(/[\n,;]+/)
					.map((item) => item.trim())
					.filter((item) => item);
			}
		}

		return [];
	}

	private _prettyKey(key: string) {
		return key
			.replace(/([A-Z])/g, ' $1')
			.replace(/[_-]+/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
			.replace(/^./, (char) => char.toUpperCase());
	}

	private _formatValue(value: unknown) {
		if (Array.isArray(value)) {
			return value.map((item) => String(item)).join(', ');
		}

		if (typeof value === 'object' && value !== null) {
			return JSON.stringify(value);
		}

		return String(value);
	}
}
