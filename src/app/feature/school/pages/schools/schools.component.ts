import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EDUCATION_TYPE_OPTIONS } from '../../../education/education.const';
import { EducationService } from '../../../education/education.service';
import { EducationInstitutionType } from '../../../education/education.interface';

@Component({
	imports: [RouterLink, DecimalPipe],
	templateUrl: './schools.component.html',
	styleUrl: './schools.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolsComponent {
	protected readonly educationService = inject(EducationService);
	protected readonly institutions = this.educationService.publishedInstitutions;
	protected readonly typeOptions = EDUCATION_TYPE_OPTIONS;
	protected readonly selectedType = signal<EducationInstitutionType | 'all'>('all');
	protected readonly searchTerm = signal('');
	protected readonly filteredInstitutions = computed(() => {
		const type = this.selectedType();
		const search = this.searchTerm().trim().toLowerCase();

		return this.institutions().filter((institution) => {
			const matchesType = type === 'all' || institution.type === type;
			const matchesSearch =
				!search
				|| institution.name.toLowerCase().includes(search)
				|| institution.shortName.toLowerCase().includes(search)
				|| institution.address.toLowerCase().includes(search)
				|| institution.principal.toLowerCase().includes(search);

			return matchesType && matchesSearch;
		});
	});
	protected readonly featuredInstitutions = computed(() => {
		return this.institutions().filter((institution) => institution.featured).slice(0, 3);
	});
	protected readonly totalStudents = computed(() => {
		return this.institutions().reduce((sum, institution) => sum + institution.studentsCount, 0);
	});

	protected updateSearch(value: string) {
		this.searchTerm.set(value);
	}

	protected typeLabel(value: EducationInstitutionType): string {
		return this.typeOptions.find((option) => option.value === value)?.label || value;
	}
}