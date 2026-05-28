import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

export interface MapMarker {
	title: string;
	lat: number;
	lng: number;
	phone?: string | null;
	googlePlaceUrl?: string;
	websiteUrl?: string;
	icon?: L.Icon | L.DivIcon;
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

	private defaultMarkers: MapMarker[] = [
		{ title: 'ai-lab', lat: 48.680416, lng: 26.5869576, phone: '+380679323237', googlePlaceUrl: 'https://www.google.com/maps/place/%D0%A1%D0%B0%D0%BB%D0%BE%D0%BD+%D0%9A%D1%80%D0%B0%D1%81%D0%B8+%22Al.lab%22/@48.6913184,26.5517157,13z/data=!4m6!3m5!1s0x4733b9db2dd765b9:0x880898b234ece537!8m2!3d48.680416!4d26.5869576!16s%2Fg%2F11y4791tl_', websiteUrl: 'https://ai-lab.itkamianets.com/' },
		{ title: 'all-eyes-hostel', lat: 48.68213, lng: 26.58656, phone: '+380971545454', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2618.337!2d26.58656!3d48.68213', websiteUrl: 'https://all-eyes-hostel.itkamianets.com/' },
		{ title: 'baron-munchausen', lat: 48.660965, lng: 26.5985317, phone: '+380675101504', googlePlaceUrl: 'https://www.google.com/maps/place/%D0%91%D0%B0%D1%80%D0%BE%D0%BD+%D0%9C%D1%8E%D0%BD%D1%85%D0%B0%D1%83%D0%B7%D0%B5%D0%BD/@48.660399,26.5989459,17z', websiteUrl: 'https://baron-munchausen.itkamianets.com/' },
		{ title: 'berry-wine', lat: 48.6759, lng: 26.5706, phone: '+380686522975', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2596.67!2d26.5706!3d48.6759', websiteUrl: 'https://it-kamianets.github.io/berry-wine.itkamianets.com/' },
		{ title: 'bilyi-patsyuk', lat: 48.68002, lng: 26.57239, phone: '+380672683727', googlePlaceUrl: 'https://maps.google.com/?q=48.68002,26.57239', websiteUrl: 'http://bilyi-patsyuk.itkamianets.com/' },
		{ title: 'bona', lat: 48.6756895, lng: 26.5731821, phone: '+380980001544', googlePlaceUrl: 'https://www.google.com/maps/place/БОНА/@48.6756895,26.5731821,17z', websiteUrl: 'http://bona.itkamianets.com/' },
		{ title: 'bunker-gym', lat: 48.677169, lng: 26.5878474, phone: '+380961447928', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2613.5623034988!2d26.5878474!3d48.677169', websiteUrl: 'https://bunker-gym.itkamianets.com/' },
		{ title: 'daniel', lat: 48.676291, lng: 26.5739593, phone: '+380507232362', googlePlaceUrl: 'https://www.google.com/maps/place/Daniel/@48.6763597,26.5714248,17z', websiteUrl: 'https://daniel.itkamianets.com/' },
		{ title: 'deluxe', lat: 48.6990168, lng: 26.5722715, phone: '+380931709524', googlePlaceUrl: 'https://www.google.com/maps/place/DELUXE/@48.6990168,26.5696966,17z', websiteUrl: 'http://deluxe.itkamianets.com/' },
		{ title: 'dominicana', lat: 48.67433057130777, lng: 26.569981176453844, phone: null, googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2634.6293685865535!2d26.569981176453844!3d48.67433057130777', websiteUrl: 'http://dominicana.itkamianets.com/' },
		{ title: 'estate-canyon', lat: 48.6685893, lng: 26.565588, phone: '+380974767777', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2613.626244408103!2d26.565588!3d48.6685893', websiteUrl: 'http://estate-canyon.itkamianets.com/' },
		{ title: 'filvarky-tsentr', lat: 48.6646182, lng: 26.5796764, phone: '+380980066088', googlePlaceUrl: 'https://www.google.com/maps/place/%D0%A4%D1%96%D0%BB%D1%8C%D0%B2%D0%B0%D1%80%D0%BA%D0%B8+%D0%A6%D0%B5%D0%BD%D1%82%D1%80/@48.6646182,26.5796764,17z', websiteUrl: 'http://filvarky-tsentr.itkamianets.com/' },
		{ title: 'gala-hotel', lat: 48.6650329, lng: 26.5790471, phone: '+380673812221', googlePlaceUrl: 'https://www.google.com/maps/place/%D0%93%D0%B0%D0%BB%D0%B0+%D0%93%D0%BE%D1%82%D0%B5%D0%BB%D1%8C/@48.6649509,26.5788297,17z', websiteUrl: 'http://gala-hotel.itkamianets.com/' },
		{ title: 'hetman', lat: 48.6777, lng: 26.5831, phone: '+380675882215', googlePlaceUrl: 'https://maps.google.com/maps?q=48.6777%2C26.5831', websiteUrl: 'http://hetman.itkamianets.com/' },
		{ title: 'kof', lat: 48.6876723, lng: 26.5807197, phone: '+380673662091', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2613.565342750343!2d26.5807197!3d48.6876723', websiteUrl: 'http://kof.itkamianets.com/' },
		{ title: 'la-mokka', lat: 48.679455, lng: 26.585569, phone: '+380770717700', googlePlaceUrl: 'https://www.google.com/maps?daddr=48.6794550000%2C26.5855690000', websiteUrl: 'http://la-mokka.itkamianets.com/' },
		{ title: 'laznya', lat: 48.6768879, lng: 26.6020558, phone: '+380384976215', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2591.1345479001334!2d26.6020558!3d48.6768879', websiteUrl: 'http://laznya.itkamianets.com/' },
		{ title: 'lumore', lat: 48.67942339071311, lng: 26.585870661669116, phone: '+380964026303', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d879.1132041794716!2d26.585870661669116!3d48.67942339071311', websiteUrl: 'http://lumore.itkamianets.com/' },
		{ title: 'maksima', lat: 48.66555367926955, lng: 26.58281131566, phone: '+380969187766', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2639.117462054619!2d26.58281131566!3d48.66555367926955', websiteUrl: 'http://maksima.itkamianets.com/' },
		{ title: 'mc', lat: 48.67858997118671, lng: 26.582496312781483, phone: '+380983820359', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2630.906233075217!2d26.582496312781483!3d48.67858997118671', websiteUrl: 'http://mc.itkamianets.com/' },
		{ title: 'meni-by-mnyasa', lat: 48.677057, lng: 26.586791, phone: '+380986319850', googlePlaceUrl: 'https://www.google.com/maps?daddr=48.6770570000%2C26.5867910000', websiteUrl: 'http://meni-by-mnyasa.itkamianets.com/' },
		{ title: 'mini-home', lat: 48.674139, lng: 26.5739245, phone: '+380970010332', googlePlaceUrl: 'https://www.google.com/maps/place/Mini+Home+Hostel/@48.674139,26.5739245,17z', websiteUrl: 'https://mini-home.itkamianets.com/' },
		{ title: 'museumsun', lat: 50.426527779472025, lng: 30.55986691573048, phone: '+380990150452', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2541.7822902825333!2d30.55986691573048!3d50.426527779472025', websiteUrl: 'http://museumsun.itkamianets.com/' },
		{ title: 'novita', lat: 48.6847211, lng: 26.597681, phone: '+380679311545', googlePlaceUrl: 'https://www.google.com/maps?q=48.6847211,26.597681&hl=uk&z=17&output=embed', websiteUrl: 'http://novita.itkamianets.com/' },
		{ title: 'optima-collection', lat: 48.6749961, lng: 26.5717488, phone: '+380672382876', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2605.5843478950343!2d26.5717488!3d48.6749961', websiteUrl: 'http://optima-collection.itkamianets.com/' },
		{ title: 'pulse-gym-club', lat: 48.6744696, lng: 26.5891048, phone: null, googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2616.5168010419356!2d26.5891048!3d48.6744696', websiteUrl: 'https://pulse-gym-club.itkamianets.com/' },
		{ title: 'sherwood', lat: 48.6647127, lng: 26.6345702, phone: '+380673803742', googlePlaceUrl: 'https://www.google.com/maps/place/%D0%A8%D0%B5%D1%80%D0%B2%D1%83%D0%B4+stream/@48.6647127,26.5583527,9190m', websiteUrl: 'http://sherwood.itkamianets.com/' },
		{ title: 'skypizza', lat: 48.67833, lng: 26.57861, phone: '+380968897354', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2613.6234053648937!2d26.57861!3d48.67833', websiteUrl: 'http://skypizza.itkamianets.com/' },
		{ title: 'smotrytska-perlyna', lat: 48.6767441, lng: 26.5578695, phone: '+380984115194', googlePlaceUrl: 'https://www.google.com/maps/place/%D0%A1%D0%BC%D0%BE%D1%82%D1%80%D0%B8%D1%86%D1%8C%D0%BA%D0%B0+%D0%9F%D0%B5%D1%80%D0%BB%D0%B8%D0%BD%D0%B0/@48.6767441,26.5578695,17z', websiteUrl: 'http://smotrytska-perlyna.itkamianets.com/' },
		{ title: 'smotrytska-vezha', lat: 48.6680244, lng: 26.5656093, phone: '+380979662565', googlePlaceUrl: 'https://www.google.com/maps/place/%D0%A1%D0%BC%D0%BE%D1%82%D1%80%D0%B8%D1%86%D1%8C%D0%BA%D0%B0+%D0%92%D0%B5%D0%B6%D0%B0/@48.6680244,26.5656093,17z', websiteUrl: 'http://smotrytska-vezha.itkamianets.com/' },
		{ title: 'spadok', lat: 48.6742433, lng: 26.5702908, phone: '+380675435074', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2631.51478!2d26.5702908!3d48.6742433', websiteUrl: 'https://spadok.itkamianets.com/' },
		{ title: 'sun-rise', lat: 48.67990881324706, lng: 26.566396076932485, phone: '+380679169154', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2618.393437251786!2d26.566396076932486!3d48.67990881324706', websiteUrl: 'https://sun-rise.itkamianets.com/' },
		{ title: 'taras-bulba', lat: 48.6744594, lng: 26.5711259, phone: '+380673811554', googlePlaceUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1295.3!2d26.5711259!3d48.6744594', websiteUrl: 'http://taras-bulba.itkamianets.com/' },
		{ title: 'vilen', lat: 48.684589, lng: 26.591684, phone: '+380672550251', googlePlaceUrl: 'https://maps.google.com/maps?q=48.684589,26.591684&z=17&t=m&output=embed', websiteUrl: 'http://vilen.itkamianets.com/' }
	];

	ngOnInit() {
		this.initializeMap();
		const markersToUse = this.markers.length > 0 ? this.markers : this.defaultMarkers;
		this.addMarkers(markersToUse);
		this.fitMapToBounds(markersToUse);
	}

	private initializeMap() {
		this.map = L.map('map', {
			center: [48.6872565, 26.5864605],
			zoom: 13,
		});

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

			const popupContent = this.createPopupContent(markerData);
			marker.bindPopup(popupContent);

			this.markerClusterGroup.addLayer(marker);
		});
	}

	private createPopupContent(markerData: MapMarker): string {
		let html = `<div class="popup-content"><strong>${markerData.title}</strong>`;

		if (markerData.phone) {
			html += `<div class="popup-item"><strong>Phone:</strong> <a href="tel:${markerData.phone}">${markerData.phone}</a></div>`;
		}

		if (markerData.websiteUrl) {
			html += `<div class="popup-item"><a href="${markerData.websiteUrl}" target="_blank" class="popup-link">Website</a></div>`;
		}

		if (markerData.googlePlaceUrl) {
			html += `<div class="popup-item"><a href="${markerData.googlePlaceUrl}" target="_blank" class="popup-link">Google Maps</a></div>`;
		}

		html += '</div>';
		return html;
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
