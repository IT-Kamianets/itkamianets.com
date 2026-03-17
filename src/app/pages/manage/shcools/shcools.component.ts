import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EDUCATION_TYPE_OPTIONS } from '../../../feature/education/education.const';
import { EducationService } from '../../../feature/education/education.service';
import { EducationInstitutionType } from '../../../feature/education/education.interface';

@Component({
	imports: [DecimalPipe],
	templateUrl: './shcools.component.html',
	styleUrl: './shcools.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShcoolsComponent {
	protected readonly educationService = inject(EducationService);
	protected readonly institutions = this.educationService.institutions;
	protected readonly typeOptions = EDUCATION_TYPE_OPTIONS;

	protected typeLabel(value: EducationInstitutionType) {
		return this.typeOptions.find((option) => option.value === value)?.label || value;
	}
}