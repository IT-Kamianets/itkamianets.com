import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROPOSALS, Proposal } from '../../data/proposals.data';

@Component({
	selector: 'app-proposals',
	imports: [DecimalPipe],
	templateUrl: './proposals.component.html',
	styleUrl: './proposals.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalsComponent {
	readonly proposals: Proposal[] = PROPOSALS;
}
