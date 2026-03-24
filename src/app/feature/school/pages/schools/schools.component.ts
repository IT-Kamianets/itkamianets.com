import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { School, SchoolService } from '../../school.service';

@Component({
	imports: [RouterLink, DecimalPipe],
	templateUrl: './schools.component.html',
	styleUrl: './schools.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchoolsComponent implements OnInit {
	private readonly _schoolService = inject(SchoolService);

	protected readonly schools = signal<School[]>([]);
	protected readonly loading = signal(true);
	protected readonly error = signal<string | null>(null);
	protected readonly selectedType = signal('all');
	protected readonly searchTerm = signal('');
	protected readonly visibleSchools = computed(() => {
		return this.schools().filter((school) => this.schoolPublished(school));
	});
	protected readonly typeOptions = computed(() => {
		const types = new Set(
			this.visibleSchools()
				.map((school) => this.schoolType(school))
				.filter(Boolean),
		);

		return Array.from(types).sort().map((value) => ({
			value,
			label: this.typeLabel(value),
		}));
	});
	protected readonly filteredSchools = computed(() => {
		const type = this.selectedType().trim().toLowerCase();
		const search = this.searchTerm().trim().toLowerCase();

		return this.visibleSchools().filter((school) => {
			const data = school.data;
			const matchesType = type === 'all' || this.schoolType(school).toLowerCase() === type;
			const matchesSearch =
				!search
				|| this.schoolTitle(school).toLowerCase().includes(search)
				|| this.schoolShortTitle(school).toLowerCase().includes(search)
				|| this.schoolDescription(school).toLowerCase().includes(search)
				|| this.schoolAddress(school).toLowerCase().includes(search)
				|| this.schoolPrincipal(school).toLowerCase().includes(search)
				|| this.schoolCourses(school).join(' ').toLowerCase().includes(search)
				|| this.schoolLessons(school).join(' ').toLowerCase().includes(search)
				|| this.schoolContact(school).toLowerCase().includes(search)
				|| this.schoolWebsite(school).toLowerCase().includes(search)
				|| (typeof data.type === 'string' && data.type.toLowerCase().includes(search));

			return matchesType && matchesSearch;
		});
	});
	protected readonly featuredSchools = computed(() => {
		return this.visibleSchools().filter((school) => school.data.featured === true).slice(0, 3);
	});
	protected readonly totalStudents = computed(() => {
		return this.visibleSchools().reduce((sum, school) => sum + this.schoolStudentsCount(school), 0);
	});

	ngOnInit() {
		this.reload();
	}

	protected reload() {
		this.loading.set(true);
		this.error.set(null);

		this._schoolService
			.getSchools()
			.pipe(finalize(() => this.loading.set(false)))
			.subscribe({
				next: (schools) => this.schools.set(schools),
				error: (error: Error) => {
					this.error.set(error.message || 'Не вдалося завантажити школи.');
					this.schools.set([]);
				},
			});
	}

	protected updateSearch(value: string) {
		this.searchTerm.set(value);
	}

	protected schoolTitle(school: School) {
		return school.data.title || 'Без назви';
	}

	protected schoolShortTitle(school: School) {
		return school.data.shortName || this.schoolTitle(school);
	}

	protected schoolDescription(school: School) {
		return school.data.description || 'Опис поки не додано.';
	}

	protected schoolType(school: School) {
		return typeof school.data.type === 'string' && school.data.type.trim()
			? school.data.type.trim()
			: 'school';
	}

	protected schoolAddress(school: School) {
		return typeof school.data.address === 'string' ? school.data.address : '';
	}

	protected schoolPrincipal(school: School) {
		return typeof school.data.principal === 'string' ? school.data.principal : '';
	}

	protected schoolContact(school: School) {
		return typeof school.data.phone === 'string' ? school.data.phone : '';
	}

	protected schoolWebsite(school: School) {
		return typeof school.data.website === 'string' ? school.data.website : '';
	}

	protected schoolCourses(school: School) {
		return Array.isArray(school.data.courses) ? school.data.courses : [];
	}

	protected schoolLessons(school: School) {
		return Array.isArray(school.data.lessons) ? school.data.lessons : [];
	}

	protected schoolStudentsCount(school: School) {
		return typeof school.data.studentsCount === 'number' ? school.data.studentsCount : 0;
	}

	protected schoolPublished(school: School) {
		return school.data.published !== false;
	}

	protected typeLabel(value: string) {
		const labels: Record<string, string> = {
			school: 'Школа',
			lyceum: 'Ліцей',
			gymnasium: 'Гімназія',
			college: 'Коледж',
			university: 'Університет',
		};

		return labels[value.toLowerCase()] || value;
	}
}