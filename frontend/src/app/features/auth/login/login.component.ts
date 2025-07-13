import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
  }

  
  

 onSubmit(): void {
  if (this.loginForm.invalid) return;

  this.loading = true;
  this.error = '';

  this.authService.login(this.loginForm.value).subscribe({
    next: (response) => {
      if (!response.token) {
        throw new Error(response.message || 'Token não recebido');
      }
      this.router.navigate([this.returnUrl]);
    },
    error: (error) => {
      console.error('Erro completo:', error);
      this.error = error.error?.message || 
                 error.message || 
                 'Erro desconhecido durante o login';
      this.loading = false;
    }
  });
}


}