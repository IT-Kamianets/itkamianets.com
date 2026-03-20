import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TEAM_MEMBERS, TeamMember } from '../../../data/team.data';

@Component({
	selector: 'app-manage-people',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './people.component.html',
	styleUrl: './people.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagePeopleComponent {
	protected readonly people = signal<TeamMember[]>([...TEAM_MEMBERS]);
	
	protected isModalOpen = signal(false);
	protected editingPerson = signal<TeamMember | null>(null);
	
	protected form = {
		name: '',
		role: '',
		avatar: '',
		internshipDates: '',
		university: '',
		isHead: false,
		socials: {
			linkedin: '',
			github: '',
			upwork: ''
		}
	};

	openAddModal() {
		this.editingPerson.set(null);
		this.form = {
			name: '',
			role: '',
			avatar: '',
			internshipDates: '',
			university: '',
			isHead: false,
			socials: { linkedin: '', github: '', upwork: '' }
		};
		this.isModalOpen.set(true);
	}

	openEditModal(person: TeamMember) {
		this.editingPerson.set(person);
		this.form = {
			name: person.name,
			role: person.role,
			avatar: person.avatar,
			internshipDates: person.internshipDates,
			university: person.university,
			isHead: person.isHead,
			socials: { ...person.socials }
		};
		this.isModalOpen.set(true);
	}

	closeModal() {
		this.isModalOpen.set(false);
		this.editingPerson.set(null);
	}

	save() {
		const editing = this.editingPerson();
		const currentPeople = this.people();
		
		if (editing) {
			const updated = currentPeople.map((p) => {
				if (p.id === editing.id) {
					return {
						...p,
						...this.form,
						socials: { ...this.form.socials }
					};
				}
				return p;
			});
			this.people.set(updated);
		} else {
			const newId = currentPeople.length > 0 ? Math.max(...currentPeople.map((p) => p.id)) + 1 : 1;
			this.people.set([...currentPeople, {
				id: newId,
				...this.form,
				socials: { ...this.form.socials }
			}]);
		}
		this.closeModal();
	}

	delete(id: number) {
		if (confirm('Ви впевнені, що хочете видалити цього учасника?')) {
			this.people.set(this.people().filter((p) => p.id !== id));
		}
	}
}
