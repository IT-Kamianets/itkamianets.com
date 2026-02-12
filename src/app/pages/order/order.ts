import { Component, signal, computed, ViewChild, AfterViewInit, WritableSignal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Proposal, PROPOSALS, CATEGORIES } from '../../data/proposals.data';

interface QualityLevel {
	label: string;
	description: string;
	multiplier: number;
}

interface SpeedLevel {
	label: string;
	description: string;
	multiplier: number;
}

@Component({
	selector: 'app-order',
	imports: [FormsModule],
	templateUrl: './order.html',
	styleUrl: './order.css',
})
export class Order implements AfterViewInit {
	@ViewChild('orderForm') orderForm!: NgForm;

	readonly proposals = PROPOSALS;
	readonly categories = CATEGORIES.filter(c => c !== 'Усі');

	readonly qualityLevels: QualityLevel[] = [
		{ label: 'Базова', description: 'Мінімальний функціонал, швидке рішення', multiplier: 0.7 },
		{ label: 'Стандартна', description: 'Оптимальне рішення для більшості задач', multiplier: 0.85 },
		{ label: 'Висока', description: 'Розширений функціонал з увагою до деталей', multiplier: 1.0 },
		{ label: 'Преміум', description: 'Максимальна якість, індивідуальний підхід', multiplier: 1.25 },
	];

	readonly speedLevels: SpeedLevel[] = [
		{ label: 'Економна', description: 'Без поспіху – знижена ціна', multiplier: 0.7 },
		{ label: 'Стандартна', description: 'Оптимальні терміни виконання', multiplier: 0.85 },
		{ label: 'Прискорена', description: 'Швидше виконання з пріоритетом', multiplier: 1.0 },
		{ label: 'Терміново', description: 'Максимальний пріоритет, найкоротші терміни', multiplier: 1.25 },
	];

	/* ── Form fields ── */
	firstName = signal('');
	lastName = signal('');
	organization = signal('');
	phone = signal('');
	email = signal('');
	selectedCategory = signal('');
	selectedProposalId = signal<number | null>(null);
	qualityIndex = signal(1);
	speedIndex = signal(1);
	includeSupport = signal(false);
	includeSeo = signal(false);
	includeAnalytics = signal(false);
	includeTraining = signal(false);
	comments = signal('');
	submitted = signal(false);
	formStatus = signal<'VALID' | 'INVALID' | 'PENDING'>('INVALID');
	phoneTouched = signal(false);

	/* ── Computed ── */
	phoneDigitCount = computed(() => {
		const prefix = '(+380) ';
		const val = this.phone();
		if (!val.startsWith(prefix)) return 0;
		return val.substring(prefix.length).replace(/[^\d]/g, '').length;
	});

	phoneDigitError = computed(() => {
		const val = this.phone();
		if (!val || val === '(+380) ') return false;
		if (!this.phoneTouched()) return false;
		const count = this.phoneDigitCount();
		return count > 0 && count < 9;
	});
	filteredProposals = computed(() => {
		const cat = this.selectedCategory();
		if (!cat) return this.proposals;
		return this.proposals.filter(p => p.category === cat);
	});

	selectedProposal = computed((): Proposal | null => {
		const id = this.selectedProposalId();
		if (!id) return null;
		return this.proposals.find(p => p.id === id) || null;
	});

	estimatedPrice = computed(() => {
		const p = this.selectedProposal();
		if (!p) return { min: 0, max: 0 };
		const qm = this.qualityLevels[this.qualityIndex()].multiplier;
		const sm = this.speedLevels[this.speedIndex()].multiplier;

		let extras = 0;
		if (this.includeSupport()) extras += 3000;
		if (this.includeSeo()) extras += 2500;
		if (this.includeAnalytics()) extras += 2000;
		if (this.includeTraining()) extras += 1500;

		const min = Math.round(p.priceFrom * qm * sm + extras);
		const max = Math.round(p.priceTo * qm * sm + extras);
		return { min, max };
	});

	isFormValid = computed(() => {
		return this.formStatus() === 'VALID'
			&& this.selectedProposalId() !== null
			&& this.phoneDigitCount() === 9;
	});

	/* ── Lifecycle ── */
	ngAfterViewInit(): void {
		this.orderForm.statusChanges?.subscribe(status => {
			if (status) {
				this.formStatus.set(status);
			}
		});
	}

	/* ── Methods ── */
	selectCategory(cat: string): void {
		this.selectedCategory.set(cat);
		this.selectedProposalId.set(null);
	}

	selectProposal(id: number): void {
		this.selectedProposalId.set(id);
	}

	setQuality(index: number): void {
		this.qualityIndex.set(index);
	}

	setSpeed(index: number): void {
		this.speedIndex.set(index);
	}

	formatPrice(n: number): string {
		return n.toLocaleString('uk-UA');
	}

	onPhoneFocus(): void {
		if (!this.phone()) {
			this.phone.set('(+380) ');
		}
	}

	onPhoneBlur(): void {
		this.phoneTouched.set(true);
		if (this.phone() === '(+380) ') {
			this.phone.set('');
		}
	}

	onPhoneKeydown(event: KeyboardEvent): void {
		const input = event.target as HTMLInputElement;
		const prefix = '(+380) ';
		const cursorPos = input.selectionStart ?? 0;

		// Allow: navigation keys, Tab, etc.
		if (['Tab', 'Escape', 'Enter'].includes(event.key)) return;

		// Block letters and special chars (allow digits, Backspace, Delete, arrows)
		if (event.key.length === 1 && !/\d/.test(event.key)) {
			event.preventDefault();
			return;
		}

		// Prevent deleting the prefix
		if (event.key === 'Backspace' && cursorPos <= prefix.length) {
			event.preventDefault();
			return;
		}
		if (event.key === 'Delete' && cursorPos < prefix.length) {
			event.preventDefault();
			return;
		}

		// Prevent typing inside the prefix
		if (event.key.length === 1 && cursorPos < prefix.length) {
			event.preventDefault();
			return;
		}

		// Prevent arrow left from entering the prefix
		if (event.key === 'ArrowLeft' && cursorPos <= prefix.length) {
			event.preventDefault();
			return;
		}
		if (event.key === 'Home') {
			event.preventDefault();
			input.setSelectionRange(prefix.length, prefix.length);
			return;
		}

		// Block if already 9 digits and pressing a digit
		if (/\d/.test(event.key)) {
			const currentDigits = this.phone().substring(prefix.length).replace(/[^\d]/g, '').length;
			if (currentDigits >= 9) {
				event.preventDefault();
				return;
			}
		}
	}

	onPhoneClick(event: Event): void {
		const input = event.target as HTMLInputElement;
		const prefix = '(+380) ';
		requestAnimationFrame(() => {
			const pos = input.selectionStart ?? 0;
			if (pos < prefix.length) {
				input.setSelectionRange(prefix.length, prefix.length);
			}
		});
	}

	onPhoneInput(event: Event): void {
		const input = event.target as HTMLInputElement;
		const prefix = '(+380) ';
		let value = input.value;

		if (!value.startsWith(prefix)) {
			value = prefix;
		}

		let numbers = value.substring(prefix.length).replace(/[^\d]/g, '');
		if (numbers.length > 9) {
			numbers = numbers.substring(0, 9);
		}

		let formatted = prefix;
		if (numbers.length > 0) formatted += numbers.substring(0, 2);
		if (numbers.length > 2) formatted += ' ' + numbers.substring(2, 5);
		if (numbers.length > 5) formatted += ' ' + numbers.substring(5, 7);
		if (numbers.length > 7) formatted += ' ' + numbers.substring(7, 9);

		this.phone.set(formatted);

		requestAnimationFrame(() => {
			input.setSelectionRange(formatted.length, formatted.length);
		});
	}

	/* ── Name input helpers ── */
	blockDigits(event: KeyboardEvent): void {
		if (event.key.length === 1 && /\d/.test(event.key)) {
			event.preventDefault();
		}
	}

	pasteLettersOnly(event: ClipboardEvent, target: WritableSignal<string>): void {
		event.preventDefault();
		const text = event.clipboardData?.getData('text') ?? '';
		const lettersOnly = text.replace(/[\d]/g, '');
		if (lettersOnly) {
			target.set(target() + lettersOnly);
		}
	}
	submitOrder(): void {
		if (!this.isFormValid()) return;
		this.submitted.set(true);
		document.body.style.overflow = 'hidden';
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	closeSuccess(): void {
		this.submitted.set(false);
		document.body.style.overflow = '';
		this.resetForm();
	}

	resetForm(): void {
		this.firstName.set('');
		this.lastName.set('');
		this.organization.set('');
		this.phone.set('');
		this.email.set('');
		this.selectedCategory.set('');
		this.selectedProposalId.set(null);
		this.qualityIndex.set(1);
		this.speedIndex.set(1);
		this.includeSupport.set(false);
		this.includeSeo.set(false);
		this.includeAnalytics.set(false);
		this.includeTraining.set(false);
		this.comments.set('');
		this.submitted.set(false);
	}
}

