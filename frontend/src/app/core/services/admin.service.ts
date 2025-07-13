import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../models/environment';
import { Admin } from '../models/admin';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/api/admin/administradores`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  getAdministradores(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getAdministradoresAtivos(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}/ativos`, {
      headers: this.getAuthHeaders()
    });
  }

  getAdministrador(id: number): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }



  criarAdministrador(admin: any): Observable<any> {
  // Prepara o objeto com valores padrão
  const adminToCreate = {
    nome: admin.nome,
    email: admin.email,
    senha: admin.senha,
    cargo: admin.cargo || null,
    role: admin.role || 'SECRETARIA', // Default para secretaria
    ativo: true
  };

  return this.http.post(this.apiUrl, adminToCreate, {
    headers: this.getAuthHeaders()
  });
}

  // Método auxiliar para limpar o objeto
  private cleanObject(obj: any): any {
    const cleanObj: any = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined && obj[key] !== null) {
        cleanObj[key] = obj[key];
      }
    });
    return cleanObj;
  }

  atualizarAdministrador(id: number, admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.apiUrl}/${id}`, admin, {
      headers: this.getAuthHeaders()
    });
  }

  alterarSenha(id: number, novaSenha: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/alterar-senha`, { novaSenha }, {
      headers: this.getAuthHeaders()
    });
  }

  toggleAtivo(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/toggle-ativo`, null, {
      headers: this.getAuthHeaders()
    });
  }

  excluirAdministrador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}