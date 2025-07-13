import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard'; // Mantenha esta importação para o guard
import { RoleGuard } from './core/models/role.guard';
import { AdminCursoFormComponent } from './features/admin/admin-cursos/admin-curso-form/admin-curso-form.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { AdminDirecaoFormComponent } from './features/admin/admin-direcao/admin-direcao/admin-direcao-form/admin-direcao-form.component';
import { AdminDocumentoFormComponent } from './features/admin/admin-documento/admin-documento-form/admin-documento-form.component';
import { AdminGaleriaFormComponent } from './features/admin/admin-galeria/admin-galeria-form/admin-galeria-form.component';
import { AdminEventoFormComponent } from './features/admin/admin-eventos/admin-evento-form/admin-evento-form.component';
import { AdminNoticiaFormComponent } from './features/admin/admin-noticias/admin-noticias/admin-noticias.component';
import { AdminAdminsFormComponent } from './features/admin/admin-admins/admin-admins-form/admin-admins-form/admin-admins-form.component';
import { LayoutAdminComponent } from './features/admin/layout-admin/layout-admin.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'cursos', // Lista de cursos
    loadComponent: () => import('./features/cursos/curso-list/curso-list.component').then(m => m.CursoListComponent)
  },
  {
      // Rota para Pré-Escolar, Ensino Primário e I Ciclo
      path: 'cursos/:categoria', 
      loadComponent: () => import('./features/cursos/curso-detail/curso-detail.component').then(m => m.CursoDetailComponent)
  },
  {
      // Rota para cursos técnicos do II Ciclo (que precisam de categoria + nomeCurso)
      path: 'cursos/:categoria/:nome', 
      loadComponent: () => import('./features/cursos/curso-detail/curso-detail.component').then(m => m.CursoDetailComponent)
  },
  {
    path: 'ensino/:id', // Detalhes de um ciclo de ensino
    loadComponent: () => import('./features/ensino/ciclo-detalhes/ciclo-detalhes/ciclo-detalhes.component').then(m => m.CicloDetalhesComponent)
  },
  {
    path: 'eventos', // Lista de eventos
    loadComponent: () => import('./features/eventos/evento-list/evento-list.component').then(m => m.EventoListComponent)
  },
  {
    path: 'eventos/:id', // Detalhes de um evento específico (assumindo que seja esta a intenção)
    loadComponent: () => import('./features/eventos/evento-detail/evento-detail.component').then(m => m.EventoDetailComponent)
  },
  {
    path: 'galerias', // Lista de eventos
    loadComponent: () => import('./features/galerias/galeria-list/galeria-list.component').then(m => m.GaleriaListComponent)
  },
  {
    path: 'galerias/:id', // Detalhes de um evento específico (assumindo que seja esta a intenção)
    loadComponent: () => import('./features/galerias/galeria-detail/galeria-detail.component').then(m => m.GaleriaDetailComponent)
  },
  {
    path: 'noticias', // Lista de eventos
    loadComponent: () => import('./features/noticias/noticia-list/noticia-list.component').then(m => m.NoticiaListComponent)
  },
  {
    path: 'noticias/:id', // Detalhes de um evento específico (assumindo que seja esta a intenção)
    loadComponent: () => import('./features/noticias/noticia-detail/noticia-detail.component').then(m => m.NoticiaDetailComponent)
  },
   {
    path: 'documentos', // Lista de eventos
    loadComponent: () => import('./features/documentos/documento-list/documento-list.component').then(m => m.DocumentoListComponent)
  },
  {
    path: 'documentos/:id', // Detalhes de um evento específico (assumindo que seja esta a intenção)
    loadComponent: () => import('./features/documentos/documento-detail/documento-detail.component').then(m => m.DocumentoDetailComponent)
  },
   {
    path: 'direcoes', // Lista de eventos
    loadComponent: () => import('./features/direcoes/direcao-list/direcao-list.component').then(m => m.DirecaoListComponent)
  },
  {
    path: 'direcoes/:id', // Detalhes de um evento específico (assumindo que seja esta a intenção)
    loadComponent: () => import('./features/direcoes/direcao-detail/direcao-detail.component').then(m => m.DirecaoDetailComponent)
  },
  {
    path: 'sobre-nos',
    loadComponent: () => import('./features/sobre-nos/sobre-nos/sobre-nos.component').then(m => m.SobreNosComponent)
  },
  {
    path: 'contato',
    loadComponent: () => import('./features/contato/contato/contato.component').then(m => m.ContatoComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  // Agrupamento de rotas de administração com um AuthGuard e sub-rotas
  {
   path: 'admin',
   canActivate: [AuthGuard],
   loadComponent: () => import('./features/admin/layout-admin/layout-admin.component').then(m => m.LayoutAdminComponent),
   children: [
    { 
      path: '', 
      redirectTo: 'admin', 
      pathMatch: 'full' 
    },
    {
      path: 'admin',
      component: DashboardComponent,
      data: { roles: ['ADMIN', 'SECRETARIA'] }
    },
    {
      path: 'admins',
      loadComponent: () => import('./features/admin/admin-admins/admin-admins/admin-admins.component').then(m => m.AdminAdminsComponent),
      data: { roles: ['ADMIN'] }
    },
    {
      path: 'novoad',
      component: AdminAdminsFormComponent,
      data: { roles: ['ADMIN'] }
    },
    {
      path: 'editarad/:id',
      component: AdminAdminsFormComponent,
      data: { roles: ['ADMIN'] }
    },
    {
      path: 'eventos',
      loadComponent: () => import('./features/admin/admin-eventos/admin-eventos.component').then(m => m.AdminEventosComponent),
      data: { roles: ['ADMIN', 'SECRETARIA'] }
    },
    {
      path: 'novoeven',
      component: AdminEventoFormComponent,
      data: { roles: ['ADMIN', 'SECRETARIA'] }
    },
    {
      path: 'editareven/:id',
      component: AdminEventoFormComponent,
      data: { roles: ['ADMIN', 'SECRETARIA'] }
    },
    {
      path: 'direcao',
      loadComponent: () => import('./features/admin/admin-direcao/admin-direcao.component').then(m => m.AdminDirecaoComponent),
      data: { roles: ['ADMIN'] }
    },
    {
      path: 'novodi',
      component: AdminDirecaoFormComponent,
      data: { roles: ['ADMIN'] }
    },
    {
      path: 'editardi/:id',
      component: AdminDirecaoFormComponent,
      data: { roles: ['ADMIN'] }
    },
    {
      path: 'documentos',
      loadComponent: () => import('./features/admin/admin-documento/admin-documento.component').then(m => m.AdminDocumentosComponent),
      data: { roles: ['ADMIN', 'SECRETARIA'] }
    },
     {
      path: 'novodoc',
      component: AdminDocumentoFormComponent,
      data: { roles: ['ADMIN', 'SECRETARIA'] }
    },
    {
      path: 'editardoc/:id',
      component: AdminDocumentoFormComponent,
      data: { roles: ['ADMIN', 'SECRETARIA'] }
    },
    {
      path: 'galeria',
      loadComponent: () => import('./features/admin/admin-galeria/admin-galeria.component').then(m => m.AdminGaleriasComponent),
      data: { roles: ['ADMIN', 'SECRETARIA'] }
    },
     {
      path: 'novogal',
      component: AdminGaleriaFormComponent,
      data: { roles: ['ADMIN', 'SECRETARIA'] }
    },
    {
      path: 'editargal/:id',
      component: AdminGaleriaFormComponent,
      data: { roles: ['ADMIN', 'SECRETARIA'] }
    },
    {
      path: 'noticias',
      loadComponent: () => import('./features/admin/admin-noticias/admin-noticias.component').then(m => m.AdminNoticiasComponent),
      data: { roles: ['ADMIN', 'SECRETARIA'] }
    },
    {
      path: 'novonot',
      component: AdminNoticiaFormComponent,
      data: { roles: ['ADMIN', 'SECRETARIA'] }
    },
    {
      path: 'editarnot/:id',
      component: AdminNoticiaFormComponent,
      data: { roles: ['ADMIN', 'SECRETARIA'] }
    },
    {
      path: 'sobre',
      loadComponent: () => import('./features/admin/admin-sobre/admin-sobre.component').then(m => m.AdminSobreComponent)
    },
    {
      path: 'mensagens',
      loadComponent: () => import('./features/admin/admin-mensagens/admin-mensagens.component').then(m => m.AdminMensagensComponent),
      data: { roles: ['ADMIN', 'SECRETARIA'] }
    },
    {
      path: 'cursos',
      loadComponent: () => import('./features/admin/admin-cursos/admin-cursos.component').then(m => m.AdminCursosComponent),
      data: { roles: ['ADMIN'] }
    },
    {
      path: 'novocu',
      component: AdminCursoFormComponent,
      data: { roles: ['ADMIN'] }
    },
    {
      path: 'editarcu/:id',
      component: AdminCursoFormComponent,
      data: { roles: ['ADMIN'] }
    }
  ]
  },
  {
    path: '**', // Rota curinga (catch-all) - deve ser a ÚLTIMA rota
    redirectTo: '/home'
  }
];