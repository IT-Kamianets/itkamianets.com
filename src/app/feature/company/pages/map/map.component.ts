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
import { Company, COMPANY_TYPES } from '../../company.interface';
import { CompanyService } from '../../company.service';

@Component({
	selector: 'app-companies-map',
	standalone: true,
	imports: [RouterLink],
	templateUrl: './map.component.html',
	styleUrl: './map.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesMapComponent implements AfterViewInit, OnDestroy {
	private _companyService = inject(CompanyService);
	private _platformId = inject(PLATFORM_ID);

	activeType = signal<string>('All');
	selectedCompany = signal<Company | null>(null);
	readonly types = COMPANY_TYPES;

	readonly filteredCompanies = computed(() => {
		const type = this.activeType();
		const all = this._companyService.companies().filter((c) => c.lat != null && c.lng != null);
		return type === 'All' ? all : all.filter((c) => c.type === type);
	});

	private L: typeof import('leaflet') | null = null;
	private map: any = null;
	private clusterGroup: any = null;
	private mapReady = false;

	constructor() {
		effect(() => {
			const companies = this.filteredCompanies();
			if (!this.mapReady) return;
			this._refreshMarkers(companies);
		});
	}

	async ngAfterViewInit() {
		if (!isPlatformBrowser(this._platformId)) return;

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
		this._refreshMarkers(this.filteredCompanies());
	}

	ngOnDestroy() {
		if (this.map) {
			this.map.remove();
		}
	}

	setFilter(type: string) {
		this.activeType.set(type);
		this.selectedCompany.set(null);
	}

	closePanelPreview() {
		this.selectedCompany.set(null);
	}

	private _escapeHtml(value: string): string {
		return value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	private _refreshMarkers(companies: Company[]) {
		if (!this.L || !this.clusterGroup) return;
		const L = this.L;

		this.clusterGroup.clearLayers();

		for (const c of companies) {
			if (c.lat == null || c.lng == null) continue;

			const icon = L.divIcon({
				className: '',
				html: `<div style="display:flex;flex-direction:column;align-items:center;gap:3px">
					<span style="display:block;width:18px;height:18px;border-radius:50%;background:#6366f1;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35)"></span>
					<span style="background:rgba(0,0,0,0.7);color:#fff;font-size:11px;font-weight:600;padding:2px 6px;border-radius:4px;white-space:nowrap;pointer-events:none">${this._escapeHtml(c.name)}</span>
				</div>`,
				iconSize: [18, 18],
				iconAnchor: [9, 0],
			});

			const marker = L.marker([c.lat, c.lng], { icon });
			marker.on('click', () => {
				this.selectedCompany.set(c);
				this.map.panTo([c.lat!, c.lng!]);
			});

			this.clusterGroup.addLayer(marker);
		}
	}
}
