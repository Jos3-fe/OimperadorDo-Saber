import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router'; // Importar RouterModule para routerLink
import { CommonModule } from '@angular/common'; // Necessário para diretivas como *ngIf

// Importar componentes de layout diretamente
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component'; // Se você usar o Sidebar no AppComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // Fornece diretivas como *ngIf, *ngFor
    RouterModule, // Para usar routerLink e routerLinkActive
    RouterOutlet, // Para renderizar as rotas
    HeaderComponent,
    FooterComponent,
   // SidebarComponent // Inclua se o sidebar for parte do layout principal
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss' // Mantenha styleUrl se for um arquivo único, ou styleUrls para array
})
export class AppComponent {
  title = 'escola-marketing-frontend';
}
