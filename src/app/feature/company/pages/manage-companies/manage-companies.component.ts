import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../company.service';
import { Company, COMPANY_TYPES } from '../../company.interface';

@Component({
	selector: 'app-manage-companies',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './manage-companies.component.html',
	styleUrl: './manage-companies.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCompaniesComponent {
	protected readonly companyService = inject(CompanyService);
	protected readonly companies = this.companyService.companies;
	protected readonly companyTypes = COMPANY_TYPES;

	protected isModalOpen = signal(false);
	protected editingCompany = signal<Company | null>(null);

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
		this.editingCompany.set(null);
		this.form = this.emptyForm();
		this.isModalOpen.set(true);
	}

	openEditModal(c: Company) {
		this.editingCompany.set(c);
		this.form = {
			name: c.name,
			logo: c.logo,
			type: c.type,
			shortDescription: c.shortDescription,
			description: c.description,
			techStack: (c.techStack ?? []).join(', '),
			services: (c.services ?? []).join(', '),
			employees: c.employees ?? 0,
			founded: c.founded ?? new Date().getFullYear(),
			openPositions: c.openPositions ?? '',
			verified: c.verified ?? false,
			lat: c.lat ?? '',
			lng: c.lng ?? '',
			website: c.contacts?.website ?? '',
			email: c.contacts?.email ?? '',
			linkedin: c.contacts?.linkedin ?? '',
			telegram: c.contacts?.telegram ?? '',
			github: c.contacts?.github ?? '',
			twitter: c.contacts?.twitter ?? '',
			facebook: c.contacts?.facebook ?? '',
			instagram: c.contacts?.instagram ?? '',
			address: c.contacts?.address ?? '',
		};
		this.isModalOpen.set(true);
	}

	closeModal() {
		this.isModalOpen.set(false);
		this.editingCompany.set(null);
	}

	save() {
		const data: Omit<Company, 'id'> = {
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

		const editing = this.editingCompany();
		if (editing) {
			this.companyService.updateCompany({ ...data, id: editing.id });
		} else {
			this.companyService.add(data);
		}
		this.closeModal();
	}

	delete(id: string) {
		if (confirm('Ви впевнені, що хочете видалити цю компанію?')) {
			this.companyService.deleteCompany(id);
		}
	}
}
