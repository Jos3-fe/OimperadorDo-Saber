import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para diretivas básicas
import { RouterModule } from '@angular/router'; // Para routerLink
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-footer',
  standalone: true, // <--- Torne o componente standalone
  imports: [
    CommonModule,
    RouterModule, // Necessário para routerLink
    ButtonModule,
    InputTextModule,
    RippleModule,
    DividerModule, // Para p-divider
    ButtonModule,  // Para p-button
    InputTextModule, // Para pInputText
    RippleModule,  // Para pRipple
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  goToSocial(platform: string) {
    const urls: any = {
      facebook: 'https://facebook.com/oimperador',
      instagram: 'https://instagram.com/oimperador',
      linkedin: 'https://linkedin.com/company/oimperador',
      youtube: 'https://youtube.com/oimperador'
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  }
}