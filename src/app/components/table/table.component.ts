import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	input,
	output,
	signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

export type TableMode = 'simple' | 'excel' | 'textarea';
export type TableColumnType = 'text' | 'number' | 'textarea' | 'boolean';
export type TableCellValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| Record<string, unknown>
	| unknown[];
export type TableRowData = Record<string, TableCellValue>;

export interface TableColumn {
	key: string;
	label: string;
	type?: TableColumnType;
	placeholder?: string;
	editable?: boolean;
	required?: boolean;
	rows?: number;
	width?: string;
	align?: 'left' | 'center' | 'right';
}

export interface TableRowSaveEvent {
	index: number;
	row: TableRowData;
	previous: TableRowData | null;
}

export interface TableRowDeleteEvent {
	index: number;
	row: TableRowData;
}

export interface TableCellChangeEvent {
	rowIndex: number;
	columnKey: string;
	column: TableColumn;
	value: TableCellValue;
	row: TableRowData;
	rows: TableRowData[];
}

export interface TableTextareaSaveEvent {
	raw: string;
	parsed: TableRowData[];
}

@Component({
	selector: 'app-table',
	imports: [CommonModule, FormsModule, TableModule, DialogModule],
	templateUrl: './table.component.html',
	styleUrl: './table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
	readonly mode = input<TableMode>('simple');
	readonly title = input('');
	readonly description = input('');
	readonly columns = input<readonly TableColumn[]>([]);
	readonly rows = input<readonly TableRowData[]>([]);
	readonly emptyMessage = input('No data available yet.');
	readonly editLabel = input('Edit');
	readonly deleteLabel = input('Delete');
	readonly saveLabel = input('Save');
	readonly updateLabel = input('Update');
	readonly dialogTitle = input('Edit row');
	readonly textareaLabel = input('JSON array');
	readonly textareaValue = input('[\n  {}\n]');
	readonly textareaPlaceholder = input('[\n  {\n    "title": "Example"\n  }\n]');
	readonly textareaRows = input(20);
	readonly showDelete = input(false);
	readonly validateTextareaJson = input(true);

	readonly rowSave = output<TableRowSaveEvent>();
	readonly rowDelete = output<TableRowDeleteEvent>();
	readonly cellChange = output<TableCellChangeEvent>();
	readonly rowsChange = output<TableRowData[]>();
	readonly textareaChange = output<string>();
	readonly textareaSave = output<TableTextareaSaveEvent>();

	protected readonly isDialogOpen = signal(false);
	protected readonly editingIndex = signal<number | null>(null);
	protected readonly simpleDraft = signal<TableRowData>({});
	protected readonly excelDraftRows = signal<TableRowData[]>([]);
	protected readonly textareaDraft = signal('[\n  {}\n]');
	protected readonly textareaError = signal('');

	protected readonly resolvedColumns = computed<TableColumn[]>(() => {
		const configured = this.columns();
		if (configured.length) {
			return configured.map((column) => ({
				type: 'text',
				editable: true,
				rows: 5,
				align: 'left',
				...column,
			}));
		}

		const [firstRow] = this.rows();
		if (!firstRow) {
			return [];
		}

		return Object.keys(firstRow).map((key) => ({
			key,
			label: this._humanize(key),
			type: this._inferColumnType(firstRow[key]),
			editable: true,
			rows: 5,
			align: 'left',
		}));
	});

	protected readonly editableColumns = computed(() =>
		this.resolvedColumns().filter((column) => column.editable !== false),
	);
	protected readonly displayRows = computed(() => this._cloneRows(this.rows()));

	protected readonly hasEditableColumns = computed(
		() => this.editableColumns().length > 0,
	);

	constructor() {
		effect(() => {
			this.excelDraftRows.set(this._cloneRows(this.rows()));
		});

		effect(() => {
			this.textareaDraft.set(this.textareaValue());
			this.textareaError.set('');
		});
	}

	protected openEdit(row: TableRowData, index: number): void {
		this.editingIndex.set(index);
		this.simpleDraft.set(this._cloneRow(row));
		this.isDialogOpen.set(true);
	}

	protected closeDialog(): void {
		this.isDialogOpen.set(false);
		this.editingIndex.set(null);
		this.simpleDraft.set({});
	}

	protected onDialogVisibleChange(visible: boolean): void {
		this.isDialogOpen.set(visible);
		if (!visible) {
			this.editingIndex.set(null);
			this.simpleDraft.set({});
		}
	}

	protected saveSimpleRow(): void {
		const index = this.editingIndex();
		if (index === null) {
			return;
		}

		const nextRow = this._cloneRow(this.simpleDraft());
		const previous = this.rows()[index] ? this._cloneRow(this.rows()[index]) : null;
		this.rowSave.emit({
			index,
			row: nextRow,
			previous,
		});
		this.closeDialog();
	}

	protected emitDelete(row: TableRowData, index: number): void {
		this.rowDelete.emit({
			index,
			row: this._cloneRow(row),
		});
	}

	protected updateDraftValue(column: TableColumn, value: unknown): void {
		this.simpleDraft.update((current) => ({
			...current,
			[column.key]: this._normalizeValue(column, value),
		}));
	}

	protected updateExcelValue(
		rowIndex: number,
		column: TableColumn,
		value: unknown,
	): void {
		const rows = this._cloneRows(this.excelDraftRows());
		const target = rows[rowIndex];
		if (!target) {
			return;
		}

		target[column.key] = this._normalizeValue(column, value);
		this.excelDraftRows.set(rows);
		this.rowsChange.emit(this._cloneRows(rows));
		this.cellChange.emit({
			rowIndex,
			columnKey: column.key,
			column,
			value: target[column.key],
			row: this._cloneRow(target),
			rows: this._cloneRows(rows),
		});
	}

	protected updateTextarea(value: string): void {
		this.textareaDraft.set(value);
		this.textareaError.set('');
		this.textareaChange.emit(value);
	}

	protected saveTextarea(): void {
		const raw = this.textareaDraft().trim();
		if (!this.validateTextareaJson()) {
			this.textareaSave.emit({
				raw,
				parsed: [],
			});
			return;
		}

		if (!raw) {
			this.textareaError.set('JSON array is required.');
			return;
		}

		try {
			const parsed = JSON.parse(raw);
			if (!Array.isArray(parsed)) {
				this.textareaError.set('Value must be a JSON array.');
				return;
			}

			const invalidIndex = parsed.findIndex(
				(item) => !item || typeof item !== 'object' || Array.isArray(item),
			);
			if (invalidIndex !== -1) {
				this.textareaError.set(
					`Each array item must be a JSON object. Invalid item at index ${invalidIndex}.`,
				);
				return;
			}

			this.textareaError.set('');
			this.textareaSave.emit({
				raw,
				parsed: parsed as TableRowData[],
			});
		} catch {
			this.textareaError.set('Provide valid JSON before updating.');
		}
	}

	protected valueAsText(row: TableRowData, column: TableColumn): string {
		const value = row[column.key];
		if (value === null || value === undefined || value === '') {
			return '—';
		}

		if (typeof value === 'boolean') {
			return value ? 'Yes' : 'No';
		}

		if (typeof value === 'object') {
			try {
				return JSON.stringify(value);
			} catch {
				return '[Object]';
			}
		}

		return String(value);
	}

	protected isColumnType(column: TableColumn, type: TableColumnType): boolean {
		return (column.type || 'text') === type;
	}

	protected fieldValue(column: TableColumn): string | number | boolean {
		const value = this.simpleDraft()[column.key];
		if (column.type === 'boolean') {
			return Boolean(value);
		}

		if (value === null || value === undefined) {
			return '';
		}

		if (typeof value === 'object') {
			try {
				return JSON.stringify(value, null, 2);
			} catch {
				return '';
			}
		}

		return value;
	}

	protected cellValue(row: TableRowData, column: TableColumn): string | number | boolean {
		const value = row[column.key];
		if (column.type === 'boolean') {
			return Boolean(value);
		}

		if (value === null || value === undefined) {
			return '';
		}

		if (typeof value === 'object') {
			try {
				return JSON.stringify(value, null, 2);
			} catch {
				return '';
			}
		}

		return value;
	}

	protected alignClass(column: TableColumn): string {
		switch (column.align) {
			case 'center':
				return 'text-center';
			case 'right':
				return 'text-right';
			default:
				return 'text-left';
		}
	}

	private _normalizeValue(column: TableColumn, value: unknown): TableCellValue {
		if (column.type === 'boolean') {
			return Boolean(value);
		}

		if (column.type === 'number') {
			if (value === '' || value === null || value === undefined) {
				return null;
			}

			const parsed = Number(value);
			return Number.isNaN(parsed) ? null : parsed;
		}

		return typeof value === 'string' ? value : String(value ?? '');
	}

	private _inferColumnType(value: TableCellValue): TableColumnType {
		if (typeof value === 'boolean') {
			return 'boolean';
		}

		if (typeof value === 'number') {
			return 'number';
		}

		if (typeof value === 'string' && value.length > 120) {
			return 'textarea';
		}

		return 'text';
	}

	private _humanize(value: string): string {
		return value
			.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
			.replace(/[_-]+/g, ' ')
			.replace(/^\w/, (letter) => letter.toUpperCase());
	}

	private _cloneRows(rows: readonly TableRowData[]): TableRowData[] {
		return rows.map((row) => this._cloneRow(row));
	}

	private _cloneRow(row: TableRowData): TableRowData {
		const clone: TableRowData = {};
		for (const [key, value] of Object.entries(row)) {
			clone[key] = this._cloneValue(value);
		}
		return clone;
	}

	private _cloneValue(value: TableCellValue): TableCellValue {
		if (Array.isArray(value)) {
			return value.map((item) =>
				item && typeof item === 'object'
					? JSON.parse(JSON.stringify(item))
					: item,
			);
		}

		if (value && typeof value === 'object') {
			return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
		}

		return value;
	}
}
