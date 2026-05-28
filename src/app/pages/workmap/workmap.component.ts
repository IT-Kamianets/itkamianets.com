import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

export interface MapMarker {
	id: string | number;
	lat: number;
	lng: number;
	title: string;
	info: string;
	icon?: L.IconOptions;
}

@Component({
	selector: 'app-workmap',
	templateUrl: './workmap.component.html',
	styleUrl: './workmap.component.scss',
	standalone: true,
})
export class WorkmapComponent implements OnInit {
	@ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
	@Input() markers: MapMarker[] = [];

	private map!: L.Map;
	private markerClusterGroup!: L.MarkerClusterGroup;

	ngOnInit() {
		this.initializeMap();
		if (this.markers.length > 0) {
			this.addMarkers(this.markers);
		}
	}

	private initializeMap() {
		this.map = L.map('map').setView([48.6872565, 26.5864605], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 19,
		}).addTo(this.map);

		this.markerClusterGroup = L.markerClusterGroup();
		this.map.addLayer(this.markerClusterGroup);

		setTimeout(() => {
			this.map.invalidateSize();
		}, 100);
	}

	addMarkers(markersArray: MapMarker[]) {
		markersArray.forEach((markerData) => {
			const marker = L.marker([markerData.lat, markerData.lng], {
				icon: markerData.icon || L.icon({
					iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
					shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
					iconSize: [25, 41],
					iconAnchor: [12, 41],
					popupAnchor: [1, -34],
					shadowSize: [41, 41],
				}),
			});

			marker.bindPopup(`<div class="popup-content"><strong>${markerData.title}</strong><p>${markerData.info}</p></div>`);

			this.markerClusterGroup.addLayer(marker);
		});
	}

	clearMarkers() {
		this.markerClusterGroup.clearLayers();
	}

	fitMapToBounds(markers: MapMarker[]) {
		if (markers.length === 0) return;

		const bounds = L.latLngBounds(
			markers.map((m) => [m.lat, m.lng] as [number, number])
		);
		this.map.fitBounds(bounds, { padding: [50, 50] });
	}
}
