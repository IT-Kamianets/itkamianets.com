import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollToTopComponent } from '../../shared/scroll-to-top.component';
import { ManageHeaderComponent } from '../../layouts/manage-header/manage-header.component';
import { CvGenerateComponent } from '../manage/cv-generation/cv-generate.component';

@Component({
	selector: 'app-cv-generation-public',
	imports: [ManageHeaderComponent, CvGenerateComponent, ScrollToTopComponent],
	templateUrl: './cv-generation-public.component.html',
	styleUrl: './cv-generation-public.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvGenerationPublicComponent {}
