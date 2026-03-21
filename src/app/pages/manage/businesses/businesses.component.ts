import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BusinessService } from '../../../feature/business/business.service';
import { Business, BUSINESS_TYPES } from '../../../feature/business/business.interface';

@Component({
	selector: 'app-manage-businesses',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './businesses.component.html',
	styleUrl: './businesses.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageBusinessesComponent {
	protected readonly businessService = inject(BusinessService);
	protected readonly businesses = this.businessService.businesses;
	protected readonly businessTypes = BUSINESS_TYPES;

	protected isModalOpen = signal(false);
	protected editingBusiness = signal<Business | null>(null);

	protected form = this.emptyForm();

	private emptyForm() {
		return {
			name: '',
			logo: '',
			type: 'Студія',
			shortDescription: '',
			description: '',
			techStack: '',
			services: '',
			employees: 0,
			founded: new Date().getFullYear(),
			openPositions: '' as number | '',
			verified: false,
			lat: '' as number | '',
			lng: '' as number | '',
			website: '',
			email: '',
			linkedin: '',
			telegram: '',
			github: '',
			twitter: '',
			facebook: '',
			instagram: '',
			address: '',
		};
	}

	openAddModal() {
		this.editingBusiness.set(null);
		this.form = this.emptyForm();
		this.isModalOpen.set(true);
	}

	openEditModal(b: Business) {
		this.editingBusiness.set(b);
		this.form = {
			name: b.name,
			logo: b.logo,
			type: b.type,
			shortDescription: b.shortDescription,
			description: b.description,
			techStack: (b.techStack ?? []).join(', '),
			services: (b.services ?? []).join(', '),
			employees: b.employees,
			founded: b.founded,
			openPositions: b.openPositions ?? '',
			verified: b.verified ?? false,
			lat: b.lat ?? '',
			lng: b.lng ?? '',
			website: b.contacts?.website ?? '',
			email: b.contacts?.email ?? '',
			linkedin: b.contacts?.linkedin ?? '',
			telegram: b.contacts?.telegram ?? '',
			github: b.contacts?.github ?? '',
			twitter: b.contacts?.twitter ?? '',
			facebook: b.contacts?.facebook ?? '',
			instagram: b.contacts?.instagram ?? '',
			address: b.contacts?.address ?? '',
		};
		this.isModalOpen.set(true);
	}

	closeModal() {
		this.isModalOpen.set(false);
		this.editingBusiness.set(null);
	}

	save() {
		const data: Omit<Business, 'id'> = {
			name: this.form.name,
			logo: this.form.logo,
			type: this.form.type,
			shortDescription: this.form.shortDescription,
			description: this.form.description,
			techStack: this.form.techStack.split(',').map(s => s.trim()).filter(Boolean),
			services: this.form.services.split(',').map(s => s.trim()).filter(Boolean),
			employees: Number(this.form.employees),
			founded: Number(this.form.founded),
			openPositions: this.form.openPositions !== '' ? Number(this.form.openPositions) : undefined,
			verified: this.form.verified || undefined,
			lat: this.form.lat !== '' ? Number(this.form.lat) : undefined,
			lng: this.form.lng !== '' ? Number(this.form.lng) : undefined,
			contacts: {
				website: this.form.website || undefined,
				email: this.form.email || undefined,
				linkedin: this.form.linkedin || undefined,
				telegram: this.form.telegram || undefined,
				github: this.form.github || undefined,
				twitter: this.form.twitter || undefined,
				facebook: this.form.facebook || undefined,
				instagram: this.form.instagram || undefined,
				address: this.form.address || undefined,
			},
		};

		const editing = this.editingBusiness();
		if (editing) {
			this.businessService.updateBusiness({ ...data, id: editing.id });
		} else {
			this.businessService.add(data);
		}
		this.closeModal();
	}

	delete(id: string) {
		if (confirm('Ви впевнені, що хочете видалити цю компанію?')) {
			this.businessService.deleteBusiness(id);
		}
	}
}
