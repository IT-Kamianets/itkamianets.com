import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollToTopComponent } from '../../shared/scroll-to-top.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
	selector: 'app-public',
	imports: [FooterComponent, HeaderComponent, RouterOutlet, ScrollToTopComponent],
	templateUrl: './public.component.html',
	styleUrl: './public.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicComponent {}
