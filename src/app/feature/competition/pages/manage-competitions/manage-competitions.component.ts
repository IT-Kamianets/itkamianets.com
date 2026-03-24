import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Textarea } from 'primeng/textarea';
import { Competition } from '../../competition.interface';
import { CompetitionService } from '../../competition.service';

type CompetitionRow = {
	_id: string;
	title: string;
	description: string;
	season: string;
	format: string;
	period: string;
	prize: string;
	tags: string;
	isActive: boolean;
	rawData: Record<string, unknown>;
};

@Component({
	imports: [FormsModule, InputText, Textarea, ButtonDirective, Checkbox, TableModule, DialogModule],
	templateUrl: './manage-competitions.component.html',
	styleUrl: './manage-competitions.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCompetitionsComponent implements OnInit {
	private readonly _competitionService = inject(CompetitionService);

	protected readonly competitions = signal<CompetitionRow[]>([]);
	protected readonly isLoading = signal(true);
	protected readonly isSaving = signal(false);
	protected readonly error = signal('');
	protected readonly isDialogVisible = signal(false);
	protected readonly dialogMode = signal<'create' | 'edit'>('create');
	protected readonly selectedCompetition = signal<CompetitionRow | null>(null);
	protected readonly formTitle = signal('');
	protected readonly formDescription = signal('');
	protected readonly formSeason = signal('');
	protected readonly formFormat = signal('');
	protected readonly formPeriod = signal('');
	protected readonly formPrize = signal('');
	protected readonly formTags = signal('');
	protected readonly formIsActive = signal(true);

	async ngOnInit() {
		await this.load();
	}

	protected async load() {
		this.isLoading.set(true);
		const docs = await this._competitionService.getAll();
		this.competitions.set(docs.map((doc) => this.toRow(doc)));
		this.isLoading.set(false);
	}

	protected openCreateDialog() {
		this.dialogMode.set('create');
		this.selectedCompetition.set(null);
		this.formTitle.set('');
		this.formDescription.set('');
		this.formSeason.set('');
		this.formFormat.set('');
		this.formPeriod.set('');
		this.formPrize.set('');
		this.formTags.set('');
		this.formIsActive.set(true);
		this.error.set('');
		this.isDialogVisible.set(true);
	}

	protected openEditDialog(row: CompetitionRow) {
		this.dialogMode.set('edit');
		this.selectedCompetition.set(row);
		this.formTitle.set(row.title);
		this.formDescription.set(row.description);
		this.formSeason.set(row.season);
		this.formFormat.set(row.format);
		this.formPeriod.set(row.period);
		this.formPrize.set(row.prize);
		this.formTags.set(row.tags);
		this.formIsActive.set(row.isActive);
		this.error.set('');
		this.isDialogVisible.set(true);
	}

	protected closeDialog() {
		this.isDialogVisible.set(false);
	}

	protected async submitDialog() {
		this.isSaving.set(true);
		this.error.set('');
		const data = this._buildPayloadData();

		const response =
			this.dialogMode() === 'create'
				? await this._competitionService.create(data)
				: await this._competitionService.update(this.selectedCompetition()?._id || '', data);

		if (!response) {
			this.error.set(
				this.dialogMode() === 'create'
					? 'Не вдалося створити змагання через API.'
					: 'Не вдалося оновити змагання через API.',
			);
		}

		this.isSaving.set(false);
		this.isDialogVisible.set(false);
		await this.load();
	}

	protected async removeCompetition(id: string) {
		this.isSaving.set(true);
		this.error.set('');
		const success = await this._competitionService.delete(id);
		if (!success) {
			this.error.set('Не вдалося видалити змагання через API.');
		}
		this.isSaving.set(false);
		await this.load();
	}

	private toRow(doc: Competition): CompetitionRow {
		return {
			_id: doc._id,
			title: this._pickString(doc.data, ['title', 'name']) || this._competitionService.getTitle(doc),
			description: this._pickString(doc.data, ['description', 'summary', 'about']),
			season: this._pickString(doc.data, ['season', 'year']),
			format: this._pickString(doc.data, ['format', 'mode']),
			period: this._pickString(doc.data, ['period', 'deadline', 'date']),
			prize: this._pickString(doc.data, ['prize', 'reward']),
			tags: this._pickStringArray(doc.data, ['tags', 'stack', 'topics']).join(', '),
			isActive: this._competitionService.isActive(doc),
			rawData: { ...doc.data },
		};
	}

	private _buildPayloadData() {
		const selected = this.selectedCompetition();
		const data = selected ? { ...selected.rawData } : {};

		const removeKeys = [
			'name',
			'summary',
			'about',
			'year',
			'mode',
			'deadline',
			'date',
			'reward',
			'stack',
			'topics',
			'status',
			'published',
		];

		for (const key of removeKeys) {
			delete data[key];
		}

		data['title'] = this.formTitle().trim();
		data['description'] = this.formDescription().trim();
		data['season'] = this.formSeason().trim();
		data['format'] = this.formFormat().trim();
		data['period'] = this.formPeriod().trim();
		data['prize'] = this.formPrize().trim();
		data['active'] = this.formIsActive();
		data['tags'] = this.formTags()
			.split(',')
			.map((tag) => tag.trim())
			.filter((tag) => tag);

		return data;
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
}
