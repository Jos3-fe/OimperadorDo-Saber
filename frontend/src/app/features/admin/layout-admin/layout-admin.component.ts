import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.scss'
})
export class LayoutAdminComponent implements OnInit {
  menuItems: any[] = [];
  adminInfo: any;
  
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('Usuário logado?', this.authService.isLoggedIn());
    console.log('Role do usuário:', this.authService.getUserRole());
    
    // Carrega as informações do admin do localStorage
    const adminData = localStorage.getItem('admin');
    console.log('Dados do admin no localStorage:', adminData); // Adicione este log
    if (adminData) {
      this.adminInfo = JSON.parse(adminData);
      console.log('Admin info parseado:', this.adminInfo); // Adicione este log
      this.buildMenu();
    } else {
      this.router.navigate(['/login']);
    }
  }

  buildMenu(): void {
    const userRole = this.authService.getUserRole();
    
    this.menuItems = [
      { 
        label: 'Dashboard', 
        icon: 'pi pi-home', 
        routerLink: ['/admin/admin'],
        roles: ['ADMIN', 'SECRETARIA']
      },
      { 
        label: 'Notícias', 
        icon: 'pi pi-newspaper', 
        routerLink: ['/admin/noticias'],
        roles: ['ADMIN', 'SECRETARIA']
      },
      { 
        label: 'Documentos', 
        icon: 'pi pi-file', 
        routerLink: ['/admin/documentos'],
        roles: ['ADMIN', 'SECRETARIA']
      },
      { 
        label: 'Mensagens', 
        icon: 'pi pi-envelope', 
        routerLink: ['/admin/mensagens'],
        roles: ['ADMIN', 'SECRETARIA']
      },
      { 
        label: 'Eventos', 
        icon: 'pi pi-calendar', 
        routerLink: ['/admin/eventos'],
        roles: ['ADMIN', 'SECRETARIA']
      },
      { 
        label: 'Galeria', 
        icon: 'pi pi-images', 
        routerLink: ['/admin/galeria'],
        roles: ['ADMIN', 'SECRETARIA']
      },
      { 
        label: 'Administradores', 
        icon: 'pi pi-users', 
        routerLink: ['/admin/admins'],
        roles: ['ADMIN']
      },
      { 
        label: 'Cursos', 
        icon: 'pi pi-book', 
        routerLink: ['/admin/cursos'],
        roles: ['ADMIN']
      },
      { 
        label: 'Direção', 
        icon: 'pi pi-id-card', 
        routerLink: ['/admin/direcao'],
        roles: ['ADMIN']
      },
      { 
        label: 'Sobre Nós', 
        icon: 'pi pi-info-circle', 
        routerLink: ['/admin/sobre'],
        roles: ['ADMIN']
      }
    ].filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(userRole);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}