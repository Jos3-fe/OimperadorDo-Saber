import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const requiredRole = next.data['requiredRole'];
    const userRole = this.authService.getUserRole();

    if (this.authService.isLoggedIn() && userRole === requiredRole) {
      return true;
    }

    this.toastr.error('Você não tem permissão para acessar esta área', 'Acesso negado');
    this.router.navigate(['/home']);
    return false;
  }
}