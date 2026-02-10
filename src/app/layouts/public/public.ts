import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { ScrollToTopComponent } from '../../shared/scroll-to-top.component';

@Component({
	selector: 'app-public',
	imports: [Footer, Header, RouterOutlet, ScrollToTopComponent],
	templateUrl: './public.html',
	styleUrl: './public.css',
})
export class Public {}
