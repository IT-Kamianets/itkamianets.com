import { Injectable, signal } from '@angular/core';
import { QUESTS } from '../../data/quests.data';
import { Quest } from './quest.interface';

@Injectable({ providedIn: 'root' })
export class QuestService {
	readonly quests = signal<Quest[]>(QUESTS as Quest[]);

	add(quest: Omit<Quest, 'id'>): void {
		const newQuest: Quest = {
			...quest,
			id: quest.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
		};
		this.quests.update(quests => [newQuest, ...quests]);
	}

	update(quest: Quest): void {
		this.quests.update(quests => quests.map(item => (item.id === quest.id ? quest : item)));
	}

	delete(id: string): void {
		this.quests.update(quests => quests.filter(item => item.id !== id));
	}
}
