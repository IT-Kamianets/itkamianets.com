import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	PLATFORM_ID,
	computed,
	effect,
	inject,
	signal,
} from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Textarea } from 'primeng/textarea';
import { Waiter } from '../../waiter.interface';

type StatusFilter = 'all' | 'active' | 'inactive';

interface WaiterFormModel {
	name: string;
	phone: string;
	notes: string;
}

const STORAGE_KEY = 'manage.waiters.v1';

@Component({
	templateUrl: './waiters-manage.component.html',
	styleUrl: './waiters-manage.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		TableModule,
		DialogModule,
		ButtonDirective,
		InputText,
		Textarea,
		FormField,
	],
})
export class WaitersManageComponent {
	private readonly _platformId = inject(PLATFORM_ID);
	private readonly _isBrowser = isPlatformBrowser(this._platformId);

	protected readonly waiters = signal<Waiter[]>([]);
	protected readonly isDialogOpen = signal(false);
	protected readonly editingId = signal<string | null>(null);
	protected readonly statusFilter = signal<StatusFilter>('all');
	protected readonly searchQuery = signal('');

	protected readonly visibleWaiters = computed(() => {
		const query = this.searchQuery().trim().toLowerCase();
		const filter = this.statusFilter();

		return this.waiters()
			.filter((waiter) => {
				if (filter === 'active' && !waiter.active) return false;
				if (filter === 'inactive' && waiter.active) return false;
				if (!query) return true;

				return (
					waiter.name.toLowerCase().includes(query) ||
					waiter.phone.toLowerCase().includes(query) ||
					waiter.notes.toLowerCase().includes(query)
				);
			})
			.slice()
			.sort((a, b) => a.name.localeCompare(b.name, 'uk'));
	});

	protected readonly model = signal<WaiterFormModel>({
		name: '',
		phone: '',
		notes: '',
	});

	protected readonly waiterForm = form(this.model, (w) => {
		required(w.name, { message: 'Вкажіть імʼя офіціанта.' });
	});

	constructor() {
		this._hydrate();
		effect(() => this._persist(this.waiters()));
	}

	protected openCreate(): void {
		this.editingId.set(null);
		this.model.set({ name: '', phone: '', notes: '' });
		this.isDialogOpen.set(true);
	}

	protected openEdit(waiter: Waiter): void {
		this.editingId.set(waiter.id);
		this.model.set({
			name: waiter.name,
			phone: waiter.phone,
			notes: waiter.notes,
		});
		this.isDialogOpen.set(true);
	}

	protected closeDialog(): void {
		this.isDialogOpen.set(false);
		this.editingId.set(null);
	}

	protected onDialogVisibleChange(visible: boolean): void {
		this.isDialogOpen.set(visible);
		if (!visible) {
			this.editingId.set(null);
		}
	}

	protected setStatusFilter(filter: StatusFilter): void {
		this.statusFilter.set(filter);
	}

	protected onSearch(event: Event): void {
		const value = (event.target as HTMLInputElement | null)?.value ?? '';
		this.searchQuery.set(value);
	}

	protected async onSubmit(event: Event): Promise<void> {
		event.preventDefault();

		await submit(this.waiterForm, async (field) => {
			const payload = this._normalizePayload(field().value());
			const editingId = this.editingId();

			if (editingId) {
				this.waiters.update((current) =>
					current.map((waiter) =>
						waiter.id === editingId
							? { ...waiter, ...payload, id: waiter.id, createdAt: waiter.createdAt }
							: waiter,
					),
				);
				this.closeDialog();
				return;
			}

			const now = new Date().toISOString();
			const next: Waiter = {
				id: this._createId(),
				active: true,
				createdAt: now,
				...payload,
			};

			this.waiters.update((current) => [next, ...current]);
			this.closeDialog();
		});
	}

	protected toggleActive(waiter: Waiter): void {
		this.waiters.update((current) =>
			current.map((item) =>
				item.id === waiter.id ? { ...item, active: !item.active } : item,
			),
		);
	}

	protected delete(waiter: Waiter): void {
		if (!confirm(`Видалити офіціанта “${waiter.name}”?`)) {
			return;
		}

		this.waiters.update((current) => current.filter((item) => item.id !== waiter.id));
		if (this.editingId() === waiter.id) {
			this.closeDialog();
		}
	}

	protected formatDate(value: string): string {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		return date.toLocaleDateString('uk-UA', { year: 'numeric', month: 'short', day: '2-digit' });
	}

	protected trackByWaiterId(index: number, waiter: Waiter): string {
		return waiter.id || String(index);
	}

	private _normalizePayload(raw: WaiterFormModel): Pick<Waiter, 'name' | 'phone' | 'notes'> {
		return {
			name: raw.name.trim(),
			phone: raw.phone.trim(),
			notes: raw.notes.trim(),
		};
	}

	private _hydrate(): void {
		if (!this._isBrowser) return;

		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;

			const parsed = JSON.parse(raw);
			if (!Array.isArray(parsed)) return;

			const waiters: Waiter[] = parsed
				.filter((item) => item && typeof item === 'object')
				.map((item) => item as Partial<Waiter>)
				.filter((item) => typeof item.id === 'string' && typeof item.name === 'string')
				.map((item) => ({
					id: item.id ?? this._createId(),
					name: item.name ?? '',
					phone: item.phone ?? '',
					notes: item.notes ?? '',
					active: item.active ?? true,
					createdAt: item.createdAt ?? new Date().toISOString(),
				}));

			this.waiters.set(waiters);
		} catch {
			// ignore corrupted storage
		}
	}

	private _persist(waiters: Waiter[]): void {
		if (!this._isBrowser) return;

		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(waiters));
		} catch {
			// ignore quota errors
		}
	}

	private _createId(): string {
		if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
			return crypto.randomUUID();
		}

		return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
	}
}
