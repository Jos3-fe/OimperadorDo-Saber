import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service'; // Ajuste o caminho se necessário
import { Router, RouterModule } from '@angular/router';
import { Admin } from '../../core/models/admin'; // Ajuste o caminho se necessário
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; // Adicionado Observable
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isMenuCollapsed = true;
  isAdminMenuOpen = false;
  // Não precisamos de uma propriedade `currentAdmin` aqui, pois vamos usar o getter do serviço

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Se precisar de alguma lógica baseada no estado de login ou admin no init,
    // pode subscrever a authService.isLoggedIn$ ou authService.currentAdmin$
    // Ou simplesmente usar os getters como no template
  }

  
  // Este getter permite aceder ao objeto Admin atual do AuthService no template
  get currentAdmin(): Admin | null {
    return this.authService.currentAdmin;
  }

 

getUserRole(): string | null {
  const role = this.authService.getUserRole();
  console.log('Header - UserRole:', role);
  return role;
}


toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  isDropdownOpen = false;

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
} 

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }


  
  toggleAdminMenu() {
    this.isAdminMenuOpen = !this.isAdminMenuOpen;
  }



}