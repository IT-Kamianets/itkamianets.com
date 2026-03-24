import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Competition } from '../../competition.interface';
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
