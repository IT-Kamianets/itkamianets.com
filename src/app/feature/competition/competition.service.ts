import { Injectable, signal } from '@angular/core';
import { Competition } from './competition.interface';

@Injectable({
	providedIn: 'root',
})
export class CompetitionService {
	competition = signal<Competition | null>(null);
}

