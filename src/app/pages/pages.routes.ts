import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './inicio';
import { NotFoundComponent } from './not-found';
import { PagesComponent } from './pages.component';

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
        path: 'cliente',
        loadChildren: () => import('./cliente/cliente.routes').then(m => m.ClienteRoutes),
      },
      {
        path: 'turma',
        loadChildren: () => import('./turma/turma.routes').then(m => m.TurmaRoutes),
      },
      {
        path: 'administrativo',
        loadChildren: () => import('./administrativo/administrativo.routes').then(m => m.AdministrativoRoutes),
      },
      {
        path: 'empresa',
        loadChildren: () => import('./empresa/empresa.routes').then(m => m.EmpresaRoutes),
      },
      {
        path: 'usuario',
        loadChildren: () => import('./usuario/usuario.routes').then(m => m.CompRoutes),
      },
      {
        path: 'conta',
        loadChildren: () => import('./financeiro/financeiro.routes').then(m => m.FinanceiroRoutes),
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
