import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TEAM_MEMBERS, TeamMember } from '../../../data/team.data';

@Component({
	selector: 'app-manage-peoples',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './peoples.component.html',
	styleUrl: './peoples.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagePeoplesComponent {
	protected readonly peoples = signal<TeamMember[]>([...TEAM_MEMBERS]);
	
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
		const currentPeoples = this.peoples();
		
		if (editing) {
			const updated = currentPeoples.map((p) => {
				if (p.id === editing.id) {
					return {
						...p,
						...this.form,
						socials: { ...this.form.socials }
					};
				}
				return p;
			});
			this.peoples.set(updated);
		} else {
			const newId = currentPeoples.length > 0 ? Math.max(...currentPeoples.map((p) => p.id)) + 1 : 1;
			this.peoples.set([...currentPeoples, {
				id: newId,
				...this.form,
				socials: { ...this.form.socials }
			}]);
		}
		this.closeModal();
	}

	delete(id: number) {
		if (confirm('Ви впевнені, що хочете видалити цього учасника?')) {
			this.peoples.set(this.peoples().filter((p) => p.id !== id));
		}
	}
}
