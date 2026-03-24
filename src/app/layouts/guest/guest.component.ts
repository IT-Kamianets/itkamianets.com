import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-guest',
	imports: [RouterOutlet],
	templateUrl: './guest.component.html',
	styleUrl: './guest.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestComponent {}
