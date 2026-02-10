import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
export class Order {
	readonly proposals = PROPOSALS;
	readonly categories = CATEGORIES.filter(c => c !== 'Усі');

	readonly qualityLevels: QualityLevel[] = [
		{ label: 'Базова', description: 'Мінімальний функціонал, швидке рішення', multiplier: 0.7 },
		{ label: 'Стандартна', description: 'Оптимальне рішення для більшості задач', multiplier: 0.85 },
		{ label: 'Висока', description: 'Розширений функціонал з увагою до деталей', multiplier: 1.0 },
		{ label: 'Преміум', description: 'Максимальна якість, індивідуальний підхід', multiplier: 1.25 },
	];

	readonly speedLevels: SpeedLevel[] = [
		{ label: 'Економна', description: 'Без поспіху — знижена ціна', multiplier: 0.7 },
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
	qualityIndex = signal(2);
	speedIndex = signal(1);
	includeSupport = signal(false);
	includeSeo = signal(false);
	includeAnalytics = signal(false);
	includeTraining = signal(false);
	comments = signal('');
	submitted = signal(false);

	/* ── Computed ── */
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
		return (
			this.firstName().trim().length > 0 &&
			this.lastName().trim().length > 0 &&
			this.phone().trim().length > 0 &&
			this.email().trim().length > 0 &&
			this.selectedProposalId() !== null
		);
	});

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

	submitOrder(): void {
		if (!this.isFormValid()) return;
		this.submitted.set(true);
		document.body.style.overflow = 'hidden';
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
		this.qualityIndex.set(2);
		this.speedIndex.set(1);
		this.includeSupport.set(false);
		this.includeSeo.set(false);
		this.includeAnalytics.set(false);
		this.includeTraining.set(false);
		this.comments.set('');
		this.submitted.set(false);
	}
}
