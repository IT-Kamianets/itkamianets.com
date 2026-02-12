import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Proposal, PROPOSALS, CATEGORIES } from '../../data/proposals.data';
import { TEAM_MEMBERS, TeamMemberFull } from '../../data/team.data';
import { CompletedProject, COMPLETED_PROJECTS } from '../../data/projects.data';

interface Testimonial {
	text: string;
	author: string;
	position: string;
	rating: number;
}

interface ServiceDirection {
	title: string;
	description: string;
	image: string;
}

@Component({
	imports: [RouterLink],
	templateUrl: './home.html',
	styleUrl: './home.css',
})
export class Home {
	readonly directions: ServiceDirection[] = [
		{
			title: 'Агроіндустрія',
			description: 'Спеціалізовані ІТ-рішення для управління аграрними процесами, логістикою та обліком.',
			image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop',
		},
		{
			title: 'Медицина',
			description: 'Системи для клінік, лабораторій та аптек – від електронних карток до логістики.',
			image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop',
		},
		{
			title: 'Заклади',
			description: 'Автоматизація замовлень, доставки та обслуговування для закладів харчування.',
			image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop',
		},
		{
			title: 'Мистецтво',
			description: 'Онлайн-галереї, магазини для митців та платформи для просування творчості.',
			image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=500&fit=crop',
		},
		{
			title: 'Автомобільна індустрія',
			description: 'Веб-рішення для автосервісів, магазинів запчастин та автошкіл.',
			image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=500&fit=crop',
		},
		{
			title: 'Мода та одяг',
			description: 'Інтернет-магазини, системи управління запасами та маркетинг для ритейлу.',
			image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=500&fit=crop',
		},
		{
			title: 'Туризм',
			description: 'Портали для бронювання, екскурсійні додатки та цифровізація турбізнесу.',
			image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop',
		},
		{
			title: 'Спорт',
			description: 'Платформи для фітнес-клубів: абонементи, розклад та клієнтська база.',
			image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop',
		},
		{
			title: 'Освіта',
			description: 'LMS-платформи, курси, тестування та управління навчальним процесом.',
			image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=500&fit=crop',
		},
	];

	readonly proposals: Proposal[] = PROPOSALS;
	readonly teamMembers = TEAM_MEMBERS;
	readonly completedProjects = COMPLETED_PROJECTS;
	selectedProposal = signal<Proposal | null>(null);
	selectedTeamMember = signal<TeamMemberFull | null>(null);
	selectedProject = signal<CompletedProject | null>(null);
	carouselOffset = signal(0);
	teamCarouselOffset = signal(0);
	projectsCarouselOffset = signal(0);
	private modalStack = signal<Array<{type: 'proposal' | 'project' | 'team', data: any}>>([]);

	readonly testimonials: Testimonial[] = [
		{ text: 'Команда IT Kamianets перевершила всі наші очікування. Систему впровадили швидко і без жодних проблем.', author: 'Василь Дорошенко', position: 'Генеральний директор, АгроХолдинг «Золоте Зерно»', rating: 5 },
		{ text: 'Професійний підхід на кожному етапі. Рекомендую всім, хто шукає надійного ІТ-партнера.', author: 'Наталія Бондаренко', position: 'Головна лікарка, Клініка «Здоров\'я+»', rating: 5 },
		{ text: 'Дуже задоволені результатом. Онлайн-замовлення збільшили наш дохід на 40% за перший місяць.', author: 'Михайло Куценко', position: 'Власник, Ресторан «Смачна Хата»', rating: 5 },
		{ text: 'Наш інтернет-магазин працює бездоганно. Клієнти відмічають зручність та швидкість.', author: 'Олена Тимчук', position: 'Засновниця, Бренд «UkrStyle»', rating: 5 },
		{ text: 'Завдяки CRM-системі ми оптимізували роботу з клієнтами і скоротили час обслуговування вдвічі.', author: 'Ігор Мельник', position: 'Директор, АвтоСервіс «ТурбоДрайв»', rating: 5 },
		{ text: 'Платформа для бронювання працює ідеально. Туристи залишають тільки позитивні відгуки.', author: 'Оксана Ковальчук', position: 'Менеджерка, Туристична агенція «Подорож»', rating: 5 },
		{ text: 'LMS-платформа повністю змінила процес навчання в нашій школі. Дякуємо за чудову роботу!', author: 'Андрій Шевченко', position: 'Директор, Освітній центр «Знання»', rating: 5 },
		{ text: 'Система управління фітнес-клубом заощаджує нам години роботи щодня. Бездоганно!', author: 'Дмитро Козлов', position: 'Власник, SportLife Club', rating: 5 },
	];

	get visibleCards(): number {
		if (typeof window === 'undefined') return 3;
		if (window.innerWidth < 640) return 1;
		if (window.innerWidth < 1024) return 2;
		return 3;
	}

	get maxOffset(): number {
		return Math.max(0, this.proposals.length - this.visibleCards);
	}

	carouselPrev(): void {
		this.carouselOffset.update(v => Math.max(0, v - 1));
	}

	carouselNext(): void {
		this.carouselOffset.update(v => Math.min(this.maxOffset, v + 1));
	}

	openProposal(proposal: Proposal): void {
		this.modalStack.set([]);
		this.selectedProposal.set(proposal);
		document.body.style.overflow = 'hidden';
	}

	closeProposal(): void {
		this.selectedProposal.set(null);
		this.popFromStack();
	}

	formatPrice(price: number): string {
		return price.toLocaleString('uk-UA');
	}

	/* ── Team carousel ── */
	get teamVisibleCards(): number {
		if (typeof window === 'undefined') return 4;
		if (window.innerWidth < 640) return 2;
		if (window.innerWidth < 1024) return 3;
		return 4;
	}

	get teamMaxOffset(): number {
		return Math.max(0, this.teamMembers.length - this.teamVisibleCards);
	}

	teamCarouselPrev(): void {
		this.teamCarouselOffset.update(v => Math.max(0, v - 1));
	}

	teamCarouselNext(): void {
		this.teamCarouselOffset.update(v => Math.min(this.teamMaxOffset, v + 1));
	}

	openTeamMember(member: TeamMemberFull): void {
		this.modalStack.set([]);
		this.selectedTeamMember.set(member);
		document.body.style.overflow = 'hidden';
	}

	closeTeamMember(): void {
		this.selectedTeamMember.set(null);
		this.popFromStack();
	}

	/* ── Projects carousel ── */
	get projectsVisibleCards(): number {
		if (typeof window === 'undefined') return 3;
		if (window.innerWidth < 640) return 1;
		if (window.innerWidth < 1024) return 2;
		return 3;
	}

	get projectsMaxOffset(): number {
		return Math.max(0, this.completedProjects.length - this.projectsVisibleCards);
	}

	projectsCarouselPrev(): void {
		this.projectsCarouselOffset.update(v => Math.max(0, v - 1));
	}

	projectsCarouselNext(): void {
		this.projectsCarouselOffset.update(v => Math.min(this.projectsMaxOffset, v + 1));
	}

	openProject(project: CompletedProject): void {
		this.modalStack.set([]);
		this.selectedProject.set(project);
		document.body.style.overflow = 'hidden';
	}

	closeProject(): void {
		this.selectedProject.set(null);
		this.popFromStack();
	}

	formatStars(rating: number): string[] {
		return Array(rating).fill('★');
	}

	/* ── Cross-modal navigation ── */
	openTeamMemberByName(name: string): void {
		const member = this.teamMembers.find(m => m.name === name);
		if (member) {
			this.pushCurrentToStack();
			this.selectedTeamMember.set(member);
			document.body.style.overflow = 'hidden';
		}
	}

	openProjectByTitle(title: string): void {
		const project = this.completedProjects.find(p => p.title === title);
		if (project) {
			this.pushCurrentToStack();
			this.selectedProject.set(project);
			document.body.style.overflow = 'hidden';
		}
	}

	openProposalByTitle(title: string): void {
		const proposal = this.proposals.find(p => p.title === title);
		if (proposal) {
			this.pushCurrentToStack();
			this.selectedProposal.set(proposal);
			document.body.style.overflow = 'hidden';
		}
	}

	getProposalsForMember(name: string): Proposal[] {
		return this.proposals.filter(p => p.team.some(m => m.name === name));
	}

	getCompletedProjectsForMember(name: string): CompletedProject[] {
		return this.completedProjects.filter(p => p.team.some(m => m.name === name));
	}

	hasStack(): boolean {
		return this.modalStack().length > 0;
	}

	closeAll(): void {
		this.selectedProposal.set(null);
		this.selectedTeamMember.set(null);
		this.selectedProject.set(null);
		this.modalStack.set([]);
		document.body.style.overflow = '';
	}

	private pushCurrentToStack(): void {
		const proposal = this.selectedProposal();
		const project = this.selectedProject();
		const team = this.selectedTeamMember();
		if (proposal) {
			this.modalStack.update(s => [...s, { type: 'proposal', data: proposal }]);
			this.selectedProposal.set(null);
		} else if (project) {
			this.modalStack.update(s => [...s, { type: 'project', data: project }]);
			this.selectedProject.set(null);
		} else if (team) {
			this.modalStack.update(s => [...s, { type: 'team', data: team }]);
			this.selectedTeamMember.set(null);
		}
	}

	private popFromStack(): void {
		const stack = this.modalStack();
		if (stack.length > 0) {
			const prev = stack[stack.length - 1];
			this.modalStack.update(s => s.slice(0, -1));
			if (prev.type === 'proposal') this.selectedProposal.set(prev.data);
			else if (prev.type === 'project') this.selectedProject.set(prev.data);
			else if (prev.type === 'team') this.selectedTeamMember.set(prev.data);
		} else {
			document.body.style.overflow = '';
		}
	}
}
