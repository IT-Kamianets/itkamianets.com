import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Observable, forkJoin } from 'rxjs';
import {
	TableCellChangeEvent,
	TableColumn,
	TableComponent,
	TableRowData,
	TableRowDeleteEvent,
	TableRowSaveEvent,
	TableTextareaSaveEvent,
} from '../../../components/table/table.component';
import { Item, ItemData } from '../../../feature/item/item.interface';
import { ItemService } from '../../../feature/item/item.service';
import { UserService } from '../../../feature/user/user.service';

type TablePageMode = 'simple' | 'excel' | 'textarea';
type MessageTone = 'success' | 'error' | 'info';

interface CreateItemDraft {
	title: string;
	type: string;
	slug: string;
	published: boolean;
	extraDataJson: string;
}

interface ManageItemRow extends TableRowData {
	order: number;
	_id: string;
	title: string;
	type: string;
	slug: string;
	published: boolean;
	jsonPreview: string;
}

interface TextareaItemRecord {
	_id?: string;
	data: ItemData;
}

type TextareaInput = TextareaItemRecord[] | ItemData;

@Component({
	templateUrl: './manage-table.component.html',
	styleUrl: './manage-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, FormsModule, DialogModule, TableComponent],
})
export class ManageTableComponent {
	private readonly _itemService = inject(ItemService);
	private readonly _userService = inject(UserService);

	protected readonly mode = signal<TablePageMode>('simple');
	protected readonly items = signal<Item[]>([]);
	protected readonly isLoading = signal(false);
	protected readonly isSaving = signal(false);
	protected readonly excelDraftRows = signal<ManageItemRow[]>([]);
	protected readonly textareaDraft = signal('[]');
	protected readonly statusTone = signal<MessageTone>('info');
	protected readonly statusMessage = signal('');
	protected readonly isCreateDialogOpen = signal(false);
	protected readonly createDraft = signal<CreateItemDraft>(this._createEmptyDraft());

	protected readonly simpleColumns: TableColumn[] = [
		{ key: 'order', label: 'ID', type: 'number', editable: false, width: '5rem' },
		{ key: 'title', label: 'Title', required: true },
		{ key: 'type', label: 'Type' },
		{ key: 'slug', label: 'Slug' },
		{
			key: 'published',
			label: 'Published',
			type: 'boolean',
			align: 'center',
			width: '9rem',
		},
		{ key: 'jsonPreview', label: 'Data preview', editable: false, width: '26rem' },
	];

	protected readonly excelColumns: TableColumn[] = [
		{ key: 'order', label: 'ID', type: 'number', editable: false, width: '5rem' },
		{ key: 'title', label: 'Title', required: true },
		{ key: 'type', label: 'Type' },
		{ key: 'slug', label: 'Slug' },
		{
			key: 'published',
			label: 'Published',
			type: 'boolean',
			align: 'center',
			width: '9rem',
		},
	];
	protected readonly jsonSavedColumns: TableColumn[] = [
		{ key: '_id', label: 'Mongo ID', editable: false, width: '16rem' },
		{ key: 'title', label: 'Title', editable: false },
		{ key: 'type', label: 'Type', editable: false },
		{ key: 'slug', label: 'Slug', editable: false },
		{
			key: 'published',
			label: 'Published',
			type: 'boolean',
			align: 'center',
			editable: false,
			width: '9rem',
		},
		{ key: 'jsonPreview', label: 'Data preview', editable: false, width: '22rem' },
	];

	protected readonly rows = computed<ManageItemRow[]>(() =>
		this.items().map((item, index) => this._itemToRow(item, index)),
	);
	protected readonly hasRows = computed(() => this.rows().length > 0);
	protected readonly textareaSnapshot = computed(() =>
		this._stringifyTextareaRecords(this.items()),
	);
	protected readonly textareaDirty = computed(
		() =>
			this._normalizeJsonText(this.textareaDraft()) !==
			this._normalizeJsonText(this.textareaSnapshot()),
	);

	protected readonly excelDirtyCount = computed(() => {
		const currentById = new Map(
			this.rows().map((row) => [row._id, this._compareSignature(row)]),
		);

		return this.excelDraftRows().filter(
			(row) => currentById.get(row._id) !== this._compareSignature(row),
		).length;
	});

	protected readonly canMutate = computed(
		() => Boolean(this._userService.user().token?.trim()) && !this.isSaving(),
	);

	constructor() {
		this.reload();
	}

	protected setMode(mode: TablePageMode): void {
		this.mode.set(mode);
		this.statusMessage.set('');
	}

	protected reload(options?: { preserveStatus?: boolean }): void {
		const preserveStatus = options?.preserveStatus ?? false;

		this.isLoading.set(true);
		this._itemService.getAll().subscribe({
			next: (items) => {
				const nextItems = Array.isArray(items) ? items : [];
				this.items.set(nextItems);
				this.excelDraftRows.set(nextItems.map((item, index) => this._itemToRow(item, index)));
				this.textareaDraft.set(this._stringifyTextareaRecords(nextItems));
				this.isLoading.set(false);
				if (!preserveStatus) {
					this.statusMessage.set('');
				}
			},
			error: () => {
				this.items.set([]);
				this.excelDraftRows.set([]);
				this.textareaDraft.set('[]');
				this.isLoading.set(false);
				this._setStatus('error', 'Не вдалося завантажити таблицю items.');
			},
		});
	}

	protected openCreateDialog(): void {
		if (!this._ensureToken()) {
			return;
		}

		this.createDraft.set(this._createEmptyDraft());
		this.isCreateDialogOpen.set(true);
	}

	protected closeCreateDialog(): void {
		this.isCreateDialogOpen.set(false);
		this.createDraft.set(this._createEmptyDraft());
	}

	protected onCreateDialogVisibleChange(visible: boolean): void {
		this.isCreateDialogOpen.set(visible);
		if (!visible) {
			this.createDraft.set(this._createEmptyDraft());
		}
	}

	protected updateCreateDraft<K extends keyof CreateItemDraft>(
		key: K,
		value: CreateItemDraft[K],
	): void {
		this.createDraft.update((draft) => ({
			...draft,
			[key]: value,
		}));
	}

	protected submitCreateDialog(): void {
		if (!this._ensureToken()) {
			return;
		}

		const draft = this.createDraft();
		if (!draft.title.trim()) {
			this._setStatus('error', 'Поле Title є обовʼязковим для нового item.');
			return;
		}

		const payload = this._createPayloadFromDraft(draft);
		if (!payload) {
			return;
		}

		this.isSaving.set(true);
		this._createItem(payload).subscribe({
			next: (created) => {
				if (!created) {
					this.isSaving.set(false);
					this._setStatus('error', 'Не вдалося створити новий item.');
					return;
				}

				this.isSaving.set(false);
				this.closeCreateDialog();
				this._setStatus('success', 'Новий item успішно додано до таблиці.');
				this.reload({ preserveStatus: true });
			},
			error: (error) => {
				this.isSaving.set(false);
				this._setStatus(
					'error',
					this._formatError(error, 'Не вдалося створити новий item.'),
				);
			},
		});
	}

	protected handleSimpleSave(event: TableRowSaveEvent): void {
		if (!this._ensureToken()) {
			return;
		}

		const id = this._stringValue(event.row['_id']);
		const current = this.items().find((item) => item._id === id);
		if (!current) {
			this._setStatus('error', 'Не вдалося знайти запис для оновлення.');
			return;
		}

		const payload = this._mergeRowIntoData(event.row, current.data);
		this.isSaving.set(true);
		this._updateItem(id, payload).subscribe({
			next: (updated) => {
				if (!updated) {
					this.isSaving.set(false);
					this._setStatus('error', 'Не вдалося зберегти зміни рядка.');
					return;
				}

				this.isSaving.set(false);
				this._setStatus('success', 'Рядок успішно оновлено.');
				this.reload({ preserveStatus: true });
			},
			error: (error) => {
				this.isSaving.set(false);
				this._setStatus(
					'error',
					this._formatError(error, 'Не вдалося зберегти зміни рядка.'),
				);
			},
		});
	}

	protected handleSimpleDelete(event: TableRowDeleteEvent): void {
		if (!this._ensureToken()) {
			return;
		}

		const id = this._stringValue(event.row['_id']);
		if (!id) {
			this._setStatus('error', 'Не вдалося визначити id запису для видалення.');
			return;
		}

		if (!confirm(`Delete item ${id}?`)) {
			return;
		}

		this.isSaving.set(true);
		this._deleteItem(id).subscribe({
			next: (deleted) => {
				if (!deleted) {
					this.isSaving.set(false);
					this._setStatus('error', 'Не вдалося видалити запис.');
					return;
				}

				this.isSaving.set(false);
				this._setStatus('success', 'Запис успішно видалено.');
				this.reload({ preserveStatus: true });
			},
			error: (error) => {
				this.isSaving.set(false);
				this._setStatus(
					'error',
					this._formatError(error, 'Не вдалося видалити запис.'),
				);
			},
		});
	}

	protected handleExcelRowsChange(rows: TableRowData[]): void {
		this.excelDraftRows.set(rows.map((row, index) => this._toManageRow(row, index)));
	}

	protected handleExcelCellChange(event: TableCellChangeEvent): void {
		this._setStatus(
			'info',
			`Оновлено поле "${event.column.label}" у рядку ${event.rowIndex + 1}. Не забудьте зберегти inline-зміни.`,
		);
	}

	protected saveExcelChanges(): void {
		if (!this._ensureToken()) {
			return;
		}

		const operations = this.excelDraftRows()
			.map((row) => {
				const current = this.items().find((item) => item._id === row._id);
				if (!current) {
					if (!this._rowHasMeaningfulContent(row)) {
						return null;
					}

					return {
						kind: 'create' as const,
						request: this._createItem(this._rowToCreatePayload(row)),
					};
				}

				const currentIndex = this.items().findIndex((item) => item._id === current._id);
				const currentSignature = this._compareSignature(
					this._itemToRow(current, currentIndex === -1 ? 0 : currentIndex),
				);
				if (currentSignature === this._compareSignature(row)) {
					return null;
				}

				return {
					kind: 'update' as const,
					request: this._updateItem(current._id, this._mergeRowIntoData(row, current.data)),
				};
			})
			.filter(
				(
					value,
				): value is {
					kind: 'create' | 'update';
					request: Observable<Item | null>;
				} => Boolean(value),
			);

		if (!operations.length) {
			this._setStatus('info', 'Немає inline-змін для збереження.');
			return;
		}

		this.isSaving.set(true);
		forkJoin(operations.map((operation) => operation.request)).subscribe({
			next: (results) => {
				const successCount = results.filter(Boolean).length;
				this.isSaving.set(false);
				if (successCount !== operations.length) {
					this._setStatus(
						'error',
						`Збережено ${successCount} з ${operations.length} inline-змін. Перевірте записи з помилкою.`,
					);
					this.reload({ preserveStatus: true });
					return;
				}

				this._setStatus(
					'success',
					`Успішно застосовано ${successCount} inline-змін або створень.`,
				);
				this.reload({ preserveStatus: true });
			},
			error: (error) => {
				this.isSaving.set(false);
				this._setStatus(
					'error',
					this._formatError(error, 'Не вдалося зберегти inline-зміни.'),
				);
			},
		});
	}

	protected handleTextareaChange(value: string): void {
		this.textareaDraft.set(value);
	}

	protected restoreTextareaDraft(): void {
		this.textareaDraft.set(this.textareaSnapshot());
		this._setStatus('info', 'JSON редактор синхронізовано з поточними item records.');
	}

	protected loadTextareaCreateExample(): void {
		this.textareaDraft.set(this._buildTextareaCreateExample());
		this._setStatus('info', 'У JSON редактор вставлено приклад для створення нового item.');
	}

	protected loadTextareaUpdateExample(): void {
		this.textareaDraft.set(this._buildTextareaUpdateExample());
		this._setStatus('info', 'У JSON редактор вставлено приклад для оновлення існуючого item.');
	}

	protected handleTextareaSave(event: TableTextareaSaveEvent): void {
		if (!this._ensureToken()) {
			return;
		}

		const normalized = this._normalizeTextareaInput(event.raw);
		if (!normalized) {
			return;
		}

		const records = Array.isArray(normalized)
			? normalized
			: [{ data: normalized satisfies ItemData }];

		if (!records.length) {
			this._setStatus('info', 'JSON масив порожній. Немає що оновлювати.');
			return;
		}

		this.isSaving.set(true);
		const requests = records.map((record) =>
			record._id ? this._updateItem(record._id, record.data) : this._createItem(record.data),
		);

		forkJoin(requests).subscribe({
			next: (results) => {
				const successCount = results.filter(Boolean).length;
				this.isSaving.set(false);
				if (successCount !== requests.length) {
					this._setStatus(
						'error',
						`Оброблено ${successCount} з ${requests.length} JSON записів. Частина змін не збереглася.`,
					);
					this.reload({ preserveStatus: true });
					return;
				}

				this._setStatus(
					'success',
					`JSON режим оновив ${successCount} записів. Поточний backend snapshot вже перезавантажено в редактор, а збережені записи видно в Saved records preview.`,
				);
				this.reload({ preserveStatus: true });
			},
			error: (error) => {
				this.isSaving.set(false);
				this._setStatus(
					'error',
					this._formatError(error, 'Не вдалося застосувати JSON-оновлення.'),
				);
			},
		});
	}

	private _itemToRow(item: Item, index = 0): ManageItemRow {
		return {
			order: index + 1,
			_id: item._id,
			title: this._pickString(item.data, ['title', 'name', 'label']),
			type: this._stringValue(item.data['type']),
			slug: this._pickString(item.data, ['slug', 'href']),
			published: this._booleanValue(item.data['published']),
			jsonPreview: this._previewData(item.data),
		};
	}

	private _toManageRow(row: TableRowData, index = 0): ManageItemRow {
		return {
			order: index + 1,
			_id: this._stringValue(row['_id']),
			title: this._stringValue(row['title']),
			type: this._stringValue(row['type']),
			slug: this._stringValue(row['slug']),
			published: this._booleanValue(row['published']),
			jsonPreview: this._stringValue(row['jsonPreview']),
		};
	}

	private _mergeRowIntoData(row: TableRowData, original: ItemData): ItemData {
		const next: ItemData = {
			...original,
			title: this._stringValue(row['title']).trim(),
			type: this._stringValue(row['type']).trim(),
			slug: this._stringValue(row['slug']).trim(),
			published: this._booleanValue(row['published']),
		};

		if (!next['title']) {
			delete next['title'];
		}

		if (!next['type']) {
			delete next['type'];
		}

		if (!next['slug']) {
			delete next['slug'];
		}

		if (!next['published']) {
			delete next['published'];
		}

		return next;
	}

	private _parseTextareaRecord(row: TableRowData): TextareaItemRecord | null {
		const id = this._stringValue(row['_id']).trim();
		const data = row['data'];
		if (!data || typeof data !== 'object' || Array.isArray(data)) {
			return null;
		}

		return {
			_id: id || undefined,
			data: data as ItemData,
		};
	}

	private _normalizeTextareaInput(raw: string): TextareaInput | null {
		const trimmed = raw.trim();
		if (!trimmed) {
			this._setStatus('error', 'JSON payload не може бути порожнім.');
			return null;
		}

		let parsed: unknown;
		try {
			parsed = JSON.parse(trimmed);
		} catch {
			this._setStatus('error', 'JSON payload має бути валідним JSON.');
			return null;
		}

		if (Array.isArray(parsed)) {
			return this._normalizeTextareaArray(parsed);
		}

		if (!parsed || typeof parsed !== 'object') {
			this._setStatus(
				'error',
				'JSON режим приймає або масив обʼєктів, або один обʼєкт для створення/оновлення item data.',
			);
			return null;
		}

		const record = this._normalizeTextareaEntry(parsed);
		if (record) {
			if (record._id) {
				const knownIds = new Set(this.items().map((item) => item._id));
				if (!knownIds.has(record._id)) {
					this._setStatus(
						'error',
						`Запис з _id "${record._id}" відсутній у поточному наборі. Приберіть _id або оновіть дані.`,
					);
					return null;
				}
			}

			return [record];
		}

		return parsed as ItemData;
	}

	private _normalizeTextareaArray(items: unknown[]): TextareaItemRecord[] | null {
		const knownIds = new Set(this.items().map((item) => item._id));
		const records: TextareaItemRecord[] = [];

		for (const item of items) {
			const record = this._normalizeTextareaEntry(item);
			if (!record) {
				this._setStatus(
					'error',
					'Кожен елемент масиву має бути або raw object, або { "_id"?: string, "data": { ... } }.',
				);
				return null;
			}

			if (record._id && !knownIds.has(record._id)) {
				this._setStatus(
					'error',
					`Запис з _id "${record._id}" відсутній у поточному наборі. Приберіть _id або оновіть дані.`,
				);
				return null;
			}

			records.push(record);
		}

		return records;
	}

	private _normalizeTextareaEntry(item: unknown): TextareaItemRecord | null {
		if (!item || typeof item !== 'object' || Array.isArray(item)) {
			return null;
		}

		const record = item as Record<string, unknown>;
		if (
			'data' in record &&
			record['data'] &&
			typeof record['data'] === 'object' &&
			!Array.isArray(record['data'])
		) {
			return {
				_id: this._stringValue(record['_id']).trim() || undefined,
				data: record['data'] as ItemData,
			};
		}

		const rawData = { ...record } as ItemData;
		const id = this._stringValue(record['_id']).trim();
		delete rawData['_id'];

		return {
			_id: id || undefined,
			data: rawData,
		};
	}

	private _previewData(data: ItemData): string {
		const previewData = { ...(data ?? {}) };
		delete previewData['title'];
		delete previewData['name'];
		delete previewData['label'];
		delete previewData['type'];
		delete previewData['slug'];
		delete previewData['href'];
		delete previewData['published'];

		try {
			const keys = Object.keys(previewData);
			if (keys.length === 0) {
				return '-';
			}

			const summary = keys
				.map((key) => `${key}: ${this._previewValue(previewData[key])}`)
				.join('; ');

			return summary.length > 180 ? `${summary.slice(0, 177)}...` : summary;
		} catch {
			return '-';
		}
	}

	private _stringifyTextareaRecords(items: Item[]): string {
		return JSON.stringify(
			items.map((item) => ({
				_id: item._id,
				data: item.data,
			})),
			null,
			2,
		);
	}

	private _buildTextareaCreateExample(): string {
		return JSON.stringify(
			[
				{
					data: {
						title: 'Example item',
						type: 'generic',
						slug: 'example-item',
						published: false,
						category: 'news',
						image: '/assets/images/example.jpg',
					},
				},
			],
			null,
			2,
		);
	}

	private _buildTextareaUpdateExample(): string {
		const [firstItem] = this.items();
		if (!firstItem) {
			return this._buildTextareaCreateExample();
		}

		return JSON.stringify(
			[
				{
					_id: firstItem._id,
					data: {
						...firstItem.data,
						title: `${this._pickString(firstItem.data, ['title', 'name', 'label']) || 'Updated item'} (updated)`,
					},
				},
			],
			null,
			2,
		);
	}

	private _compareSignature(row: ManageItemRow): string {
		return JSON.stringify({
			title: row.title,
			type: row.type,
			slug: row.slug,
			published: row.published,
		});
	}

	private _createEmptyDraft(): CreateItemDraft {
		return {
			title: '',
			type: 'generic',
			slug: '',
			published: false,
			extraDataJson: '',
		};
	}

	private _createPayloadFromDraft(draft: CreateItemDraft): ItemData | null {
		const extraData = this._parseCreateExtraData(draft.extraDataJson);
		if (!extraData) {
			return null;
		}

		return this._mergeRowIntoData(
			{
				title: draft.title,
				type: draft.type || 'generic',
				slug: draft.slug,
				published: draft.published,
			},
			extraData,
		);
	}

	private _rowToCreatePayload(row: ManageItemRow): ItemData {
		return this._mergeRowIntoData(row, {});
	}

	private _parseCreateExtraData(raw: string): ItemData | null {
		const trimmed = raw.trim();
		if (!trimmed) {
			return {};
		}

		let parsed: unknown;
		try {
			parsed = JSON.parse(trimmed);
		} catch {
			this._setStatus('error', 'Extra data має бути валідним JSON object.');
			return null;
		}

		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			this._setStatus('error', 'Extra data приймає лише JSON object, не масив і не примітив.');
			return null;
		}

		return { ...(parsed as ItemData) };
	}

	private _rowHasMeaningfulContent(row: ManageItemRow): boolean {
		return Boolean(row.title.trim() || row.type.trim() || row.slug.trim() || row.published);
	}

	private _pickString(data: ItemData, keys: string[]): string {
		for (const key of keys) {
			const value = data[key];
			if (typeof value === 'string') {
				return value;
			}
		}

		return '';
	}

	private _stringValue(value: unknown): string {
		return typeof value === 'string' ? value : value ? String(value) : '';
	}

	private _booleanValue(value: unknown): boolean {
		return value === true;
	}

	private _createItem(data: ItemData): Observable<Item | null> {
		return this._itemService.create(data);
	}

	private _updateItem(id: string, data: ItemData): Observable<Item | null> {
		return this._itemService.update(id, data);
	}

	private _deleteItem(id: string): Observable<boolean> {
		return this._itemService.delete(id);
	}

	private _formatError(error: unknown, fallback: string): string {
		if (!error || typeof error !== 'object') {
			return fallback;
		}

		const record = error as Record<string, unknown>;
		const status = typeof record['status'] === 'number' ? record['status'] : null;
		const message =
			typeof record['message'] === 'string'
				? record['message']
				: typeof record['error'] === 'string'
					? record['error']
					: typeof record['msg'] === 'string'
						? record['msg']
						: '';

		if (status && message) {
			return `${fallback} [${status}] ${message}`;
		}

		if (status) {
			return `${fallback} [${status}]`;
		}

		if (message) {
			return `${fallback} ${message}`;
		}

		return fallback;
	}

	private _setStatus(tone: MessageTone, message: string): void {
		this.statusTone.set(tone);
		this.statusMessage.set(message);
	}

	private _normalizeJsonText(value: string): string {
		return value.trim().replace(/\r\n/g, '\n');
	}

	private _previewValue(value: unknown): string {
		if (Array.isArray(value)) {
			return `[${value.length} items]`;
		}

		if (value && typeof value === 'object') {
			const keys = Object.keys(value as Record<string, unknown>);
			if (!keys.length) {
				return '{empty}';
			}

			const label = keys.slice(0, 3).join(', ');
			return keys.length > 3 ? `{${label}, ...}` : `{${label}}`;
		}

		if (typeof value === 'string') {
			return value.length > 48 ? `${value.slice(0, 45)}...` : value;
		}

		if (typeof value === 'boolean') {
			return value ? 'true' : 'false';
		}

		return value === null || value === undefined ? 'null' : String(value);
	}

	private _ensureToken(): boolean {
		if (this._userService.user().token?.trim()) {
			return true;
		}

		this._setStatus(
			'error',
			'Для змін потрібен API token у поточній сесії. Вийдіть і увійдіть знову.',
		);
		return false;
	}
}
