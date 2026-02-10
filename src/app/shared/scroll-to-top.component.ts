import {
	Component,
	ChangeDetectionStrategy,
	signal,
	inject,
	PLATFORM_ID,
	OnInit,
	OnDestroy,
	NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
	selector: 'app-scroll-to-top',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button
			class="scroll-top-btn"
			[class.scroll-top-btn--visible]="visible()"
			[style.bottom.px]="bottomOffset()"
			(click)="scrollToTop()"
			aria-label="Прокрутити вгору"
		>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="18 15 12 9 6 15"/>
			</svg>
		</button>
	`,
	styles: [`
		.scroll-top-btn {
			position: fixed;
			right: 24px;
			z-index: 900;
			width: 44px;
			height: 44px;
			border-radius: 50%;
			border: 1px solid var(--c-border);
			background: var(--c-bg-secondary);
			color: var(--c-text-primary);
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
			opacity: 0;
			visibility: hidden;
			transform: translateY(10px);
			transition: opacity 0.35s ease, visibility 0.35s ease, transform 0.35s ease, box-shadow 0.25s ease, background 0.25s ease;
			pointer-events: none;
		}

		.scroll-top-btn--visible {
			opacity: 1;
			visibility: visible;
			transform: translateY(0);
			pointer-events: auto;
		}

		.scroll-top-btn:hover {
			transform: translateY(-3px);
			box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
			background: var(--c-primary);
			color: #fff;
			border-color: var(--c-primary);
		}
	`],
})
export class ScrollToTopComponent implements OnInit, OnDestroy {
	private readonly platformId = inject(PLATFORM_ID);
	private readonly zone = inject(NgZone);

	visible = signal(false);
	bottomOffset = signal(24);

	private scrollListener?: () => void;

	ngOnInit(): void {
		if (!isPlatformBrowser(this.platformId)) return;

		this.zone.runOutsideAngular(() => {
			this.scrollListener = () => this.onScroll();
			window.addEventListener('scroll', this.scrollListener, { passive: true });
		});
	}

	ngOnDestroy(): void {
		if (this.scrollListener) {
			window.removeEventListener('scroll', this.scrollListener);
		}
	}

	private onScroll(): void {
		const scrollY = window.scrollY;
		const shouldShow = scrollY > 400;

		// Calculate bottom offset to stay above footer
		const footer = document.querySelector('footer');
		let offset = 24;
		if (footer) {
			const footerRect = footer.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			if (footerRect.top < windowHeight) {
				offset = windowHeight - footerRect.top + 16;
			}
		}

		const wasVisible = this.visible();
		const prevOffset = this.bottomOffset();

		if (shouldShow !== wasVisible || offset !== prevOffset) {
			this.zone.run(() => {
				this.visible.set(shouldShow);
				this.bottomOffset.set(offset);
			});
		}
	}

	scrollToTop(): void {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
}
