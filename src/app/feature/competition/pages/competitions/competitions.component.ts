import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Competition } from '../../competition.interface';
import { CompetitionService } from '../../competition.service';

@Component({
	selector: 'app-competitions',
	imports: [RouterLink],
	templateUrl: './competitions.component.html',
	styleUrl: './competitions.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetitionsComponent implements OnInit {
	private readonly _competitionService = inject(CompetitionService);

	protected readonly isLoading = signal(true);
	protected readonly competitions = signal<Competition[]>([]);

	protected readonly activeCompetitions = computed(() =>
		this.competitions().filter((item) => this._competitionService.isActive(item)),
	);
	protected readonly inactiveCompetitions = computed(() =>
		this.competitions().filter((item) => !this._competitionService.isActive(item)),
	);

	protected readonly getTitle = (_index: number, item: Competition) =>
		this._competitionService.getTitle(item);
	protected readonly getDescription = (_index: number, item: Competition) =>
		this._pickString(item.data, ['description', 'summary', 'about']) ||
		'Деталі змагання доступні на сторінці конкурсу.';
	protected readonly getSeason = (_index: number, item: Competition) =>
		this._pickString(item.data, ['season', 'year']);
	protected readonly getFormat = (_index: number, item: Competition) =>
		this._pickString(item.data, ['format', 'mode']);
	protected readonly getPeriod = (_index: number, item: Competition) =>
		this._pickString(item.data, ['period', 'deadline', 'date']);
	protected readonly getPrize = (_index: number, item: Competition) =>
		this._pickString(item.data, ['prize', 'reward']);
	protected readonly getTags = (_index: number, item: Competition) =>
		this._pickStringArray(item.data, ['tags', 'stack', 'topics']);
	protected readonly getParticipants = (_index: number, item: Competition) =>
		this._pickNumber(item.data, ['participants', 'teamsCount', 'membersCount']);
	protected readonly getLocation = (_index: number, item: Competition) =>
		this._pickString(item.data, ['location', 'place', 'venue']);
	protected readonly getSponsors = (_index: number, item: Competition) =>
		this._pickStringArray(item.data, ['sponsors', 'partners', 'supporters']);
	protected readonly getDeadline = (_index: number, item: Competition) =>
		this._pickString(item.data, ['deadline', 'registrationDeadline', 'date']);
	protected readonly activeCount = computed(() => this.activeCompetitions().length);
	protected readonly inactiveCount = computed(() => this.inactiveCompetitions().length);
	protected readonly totalCount = computed(() => this.competitions().length);

	async ngOnInit() {
		this.competitions.set(await this._competitionService.getAll());
		this.isLoading.set(false);
	}

	private _pickString(data: Record<string, unknown>, keys: string[]) {
		for (const key of keys) {
			const value = data[key];
			if (typeof value === 'string' && value.trim()) {
				return value.trim();
			}
		}

		return '';
	}

	private _pickStringArray(data: Record<string, unknown>, keys: string[]) {
		for (const key of keys) {
			const value = data[key];
			if (Array.isArray(value)) {
				return value.map((item) => String(item)).filter((item) => item.trim());
			}
		}

		return [];
	}

	private _pickNumber(data: Record<string, unknown>, keys: string[]) {
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
}
