import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './inicio';
import { NotFoundComponent } from './not-found';
import { PagesComponent } from './pages.component';
import { moduloConta, moduloPainel } from '../core/models/menu/modulos-financeiro';
import { moduloAdmin, moduloEmpresas, moduloUsuario } from '../core/models/menu/modulos-superadmin';
import { moduloCliente, moduloTurma } from '../core/models/menu/modulos-admin-empresa';

const routes: Routes = [
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
        loadChildren: () => import('./cliente/cliente.routes').then(m => m.ClienteRoutes),
      },
      {
        path: moduloTurma,
        loadChildren: () => import('./turma/turma.routes').then(m => m.TurmaRoutes),
      },
      {
        path: moduloAdmin,
        loadChildren: () => import('./administrativo/administrativo.routes').then(m => m.AdministrativoRoutes),
      },
      {
        path: moduloEmpresas,
        loadChildren: () => import('./empresa/empresa.routes').then(m => m.EmpresaRoutes),
      },
      {
        path: moduloUsuario,
        loadChildren: () => import('./usuario/usuario.routes').then(m => m.CompRoutes),
      },
      {
        path: moduloConta,
        loadChildren: () => import('./financeiro/financeiro.routes').then(m => m.FinanceiroRoutes),
      },
      {
        path: moduloPainel,
        loadChildren: () => import('./painel/painel.routes').then(m => m.PainelRoutes),
      },
      { path: '**', component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutes { }
