import { isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	inject,
	NgZone,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	signal,
} from '@angular/core';

@Component({
	selector: 'app-scroll-to-top',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button
			class="scroll-top-btn"
			[class.scroll-top-btn--visible]="visible()"
			[class.is-interacting]="isInteracting()"
			[style.bottom.px]="bottomOffset()"
			(click)="scrollToTop()"
			(mouseleave)="isInteracting.set(false)"
			aria-label="Прокрутити вгору"
		>
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="18 15 12 9 6 15" />
			</svg>
		</button>
	`,
	styles: [
		`
			:host {
				display: contents;
			}

			.scroll-top-btn {
				position: fixed;
				right: 24px;
				z-index: 900;
				width: 44px;
				height: 44px;
				border-radius: 50%;
				border: 1px solid #d1d5db; /* Default light theme border */
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
				transition:
					opacity 0.35s ease,
					visibility 0.35s ease,
					transform 0.35s ease,
					box-shadow 0.25s ease,
					background 0.25s ease,
					border-color 0.25s ease;
				pointer-events: none;
				will-change: transform, opacity; /* Hint for smoother animations */
			}

			:host-context(html[data-mode='dark']) .scroll-top-btn {
				border-color: #404040; /* Dark theme border */
			}

			.scroll-top-btn--visible {
				opacity: 1;
				visibility: visible;
				transform: translateY(0);
				pointer-events: auto;
			}

			/* Press animation for all devices */
			.scroll-top-btn:active {
				transform: scale(0.95);
				transition-duration: 0.08s;
			}

			/* Hover effects for desktop only */
			@media (hover: hover) {
				/* Do not apply hover transform if button is being pressed or was just clicked */
				.scroll-top-btn:hover:not(:active):not(.is-interacting) {
					transform: scale(1.1);
					border-color: var(--c-primary) !important;
					box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
				}
			}

			/* Mobile adjustments */
			@media (max-width: 768px) {
				.scroll-top-btn {
					width: 36px;
					height: 36px;
					right: 16px;
				}

				.scroll-top-btn > svg {
					width: 18px;
					height: 18px;
				}
			}
		`,
	],
})
export class ScrollToTopComponent implements OnInit, OnDestroy {
	private readonly platformId = inject(PLATFORM_ID);
	private readonly zone = inject(NgZone);

	visible = signal(false);
	bottomOffset = signal(24);
	isInteracting = signal(false); // For suppressing hover flash after click

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

		const isMobile = isPlatformBrowser(this.platformId) && window.innerWidth <= 768;
		let offset = isMobile ? 16 : 24;

		if (!isMobile) {
			// Only run the expensive footer calculation on larger screens
			const footer = document.querySelector('footer');
			if (footer) {
				const footerRect = footer.getBoundingClientRect();
				const windowHeight = window.innerHeight;
				if (footerRect.top < windowHeight) {
					offset = windowHeight - footerRect.top + 16;
				}
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
		// Suppress hover effect for a moment after click to prevent flash
		this.isInteracting.set(true);
		setTimeout(() => this.isInteracting.set(false), 400);
	}
}
