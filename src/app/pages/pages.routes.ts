import { Routes } from '@angular/router';

import { moduloCliente, moduloTurma } from '../core/models/menu/modulos-admin-empresa';
import { moduloConta, moduloPainel } from '../core/models/menu/modulos-financeiro';
import { moduloAdmin, moduloEmpresas, moduloUsuario } from '../core/models/menu/modulos-superadmin';
import { HomeComponent } from './inicio';
import { NotFoundComponent } from './not-found';
import { PagesComponent } from './pages.component';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio',
      },
      {
        path: 'inicio',
        component: HomeComponent,
      },
      {
        path: moduloCliente,
        loadChildren: () => import('./cliente/cliente.routes').then(m => m.routes),
      },
      {
        path: moduloTurma,
        loadChildren: () => import('./turma/turma.routes').then(m => m.routes),
      },
      {
        path: moduloAdmin,
        loadChildren: () => import('./administrativo/administrativo.routes').then(m => m.routes),
      },
      {
        path: moduloEmpresas,
        loadChildren: () => import('./empresa/empresa.routes').then(m => m.routes),
      },
      {
        path: moduloUsuario,
        loadChildren: () => import('./usuario/usuario.routes').then(m => m.routes),
      },
      {
        path: moduloConta,
        loadChildren: () => import('./financeiro/financeiro.routes').then(m => m.routes),
      },
      {
        path: moduloPainel,
        loadChildren: () => import('./painel/painel.routes').then(m => m.routes),
      },
      { path: '**', component: NotFoundComponent },
    ],
  },
];
