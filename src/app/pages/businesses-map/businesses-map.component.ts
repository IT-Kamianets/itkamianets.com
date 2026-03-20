import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	PLATFORM_ID,
	computed,
	effect,
	inject,
	signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Business, BUSINESS_TYPES } from '../../feature/business/business.interface';
import { BusinessService } from '../../feature/business/business.service';

@Component({
	selector: 'app-businesses-map',
	standalone: true,
	imports: [RouterLink],
	templateUrl: './businesses-map.component.html',
	styleUrl: './businesses-map.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessesMapComponent implements AfterViewInit, OnDestroy {
	private businessService = inject(BusinessService);
	private platformId = inject(PLATFORM_ID);

	activeType = signal<string>('All');
	selectedBusiness = signal<Business | null>(null);
	readonly types = BUSINESS_TYPES;

	readonly filteredBusinesses = computed(() => {
		const type = this.activeType();
		const all = this.businessService.businesses().filter((b) => b.lat && b.lng);
		return type === 'All' ? all : all.filter((b) => b.type === type);
	});

	// Leaflet types — loaded dynamically on browser only
	private L: typeof import('leaflet') | null = null;
	private map: any = null;
	private clusterGroup: any = null;
	private mapReady = false;

	constructor() {
		effect(() => {
			const businesses = this.filteredBusinesses();
			if (!this.mapReady) return;
			this.refreshMarkers(businesses);
		});
	}

	async ngAfterViewInit() {
		if (!isPlatformBrowser(this.platformId)) return;

		const leafletModule = await import('leaflet');
		const L = (leafletModule as any).default ?? leafletModule;
		await import('leaflet.markercluster');
		this.L = L;

		this.map = L.map('map-container', { zoomControl: true }).setView([48.6726, 26.5657], 14);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			maxZoom: 19,
		}).addTo(this.map);

		this.clusterGroup = (L as any).markerClusterGroup();
		this.map.addLayer(this.clusterGroup);

		this.mapReady = true;
		this.refreshMarkers(this.filteredBusinesses());
	}

	ngOnDestroy() {
		if (this.map) {
			this.map.remove();
		}
	}

	setFilter(type: string) {
		this.activeType.set(type);
		this.selectedBusiness.set(null);
	}

	closePanelPreview() {
		this.selectedBusiness.set(null);
	}

	private refreshMarkers(businesses: Business[]) {
		if (!this.L || !this.clusterGroup) return;
		const L = this.L;

		this.clusterGroup.clearLayers();

		for (const b of businesses) {
			if (!b.lat || !b.lng) continue;

			const icon = L.divIcon({
				className: '',
				html: `<span class="map-marker"></span>`,
				iconSize: [18, 18],
				iconAnchor: [9, 9],
			});

			const marker = L.marker([b.lat, b.lng], { icon });
			marker.on('click', () => {
				this.selectedBusiness.set(b);
				this.map.panTo([b.lat!, b.lng!]);
			});

			this.clusterGroup.addLayer(marker);
		}
	}
}
