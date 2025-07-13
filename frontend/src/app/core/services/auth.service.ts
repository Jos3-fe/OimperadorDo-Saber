import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Admin } from '../models/admin';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper = new JwtHelperService();

  private apiUrl = 'http://localhost:8080/api';
  private currentAdminSubject: BehaviorSubject<Admin | null>;
  public currentAdmin$: Observable<Admin | null>;

  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
    let initialAdmin: Admin | null = null;
    if (isPlatformBrowser(this.platformId)) {
      const storedAdmin = localStorage.getItem('admin');
      initialAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;
    }
    this.currentAdminSubject = new BehaviorSubject<Admin | null>(initialAdmin);
    this.currentAdmin$ = this.currentAdminSubject.asObservable();
  }
  

  getUserRole(): string {
    // Verifica se está no navegador
    if (isPlatformBrowser(this.platformId)) {
      try {
        const adminData = localStorage.getItem('admin');
        if (adminData) {
          const admin = JSON.parse(adminData);
          return admin?.role || '';
        }
      } catch (e) {
        console.error('Erro ao obter role:', e);
      }
    }
    return '';
  }

 /* getUserRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (!token) return null;

      try {
        const decoded = this.jwtHelper.decodeToken(token);
        return decoded.role;
      } catch (e) {
        return null;
      }
    }
    return null;
  }*/

  // auth.service.ts
login(credentials: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
    tap((response) => {
      console.log('Resposta completa:', response); // Debug importante
      
      if (!response.token || !response.admin) {
        throw new Error('Estrutura de resposta inválida');
      }

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('admin', JSON.stringify(response.admin));
        console.log('Dados armazenados:', { // Verificação
          token: localStorage.getItem('token'),
          admin: localStorage.getItem('admin')
        });
      }
      this.currentAdminSubject.next(response.admin);
    }),
    catchError(error => {
      console.error('Erro no login:', error);
      this.clearAuthData();
      throw error;
    })
  );
}

get currentAdmin(): Admin | null {
  if (isPlatformBrowser(this.platformId)) {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  }
  return null;
}
// auth.service.ts
getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  return new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
}

private clearAuthData(): void {
  if (isPlatformBrowser(this.platformId)) {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  }
  this.currentAdminSubject.next(null);
}




 isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      console.log('Token no localStorage:', token); // Debug
      
      if (!token) {
        console.log('Nenhum token encontrado');
        return false;
      }
      
      try {
        const isExpired = this.jwtHelper.isTokenExpired(token);
        console.log('Token expirado?', isExpired); // Debug
        
        if (isExpired) {
          this.clearAuthData();
          return false;
        }
        return true;
      } catch (e) {
        console.error('Erro ao verificar token:', e);
        this.clearAuthData();
        return false;
      }
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

 /* get currentAdmin(): Admin | null {
    return this.currentAdminSubject.getValue();
  }*/

  getUserId(): number | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (!token) return null;

      try {
        const decoded = this.jwtHelper.decodeToken(token);
        return decoded.userId;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  salvarToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
    }
    this.currentAdminSubject.next(null);
    this.toastr.success('Você foi desconectado com sucesso', 'Logout');
    this.router.navigate(['/home']);
  }



// Adicione também estes métodos auxiliares
isAdmin(): boolean {
  return this.getUserRole() === 'ADMIN';
}

isSecretaria(): boolean {
  return this.getUserRole() === 'SECRETARIA';
}



}