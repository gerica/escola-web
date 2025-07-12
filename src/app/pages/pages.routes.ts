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
        path: 'contrato',
        loadChildren: () => import('./contrato/contrato.routes').then(m => m.ContratoRoutes),
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
