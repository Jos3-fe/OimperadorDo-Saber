
import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

export const HOME_ROUTES: Routes = [
  {
    path: '', // Caminho vazio significa que este é o componente principal para a rota /home
    component: HomeComponent // O componente que será renderizado para a rota /home
  }
  // Adicione sub-rotas para a feature 'home' aqui, se houver
];
