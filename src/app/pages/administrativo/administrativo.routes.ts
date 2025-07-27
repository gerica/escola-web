import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../not-found';
import { ManterComp } from './manter/comp';
import { AuxiliarManterComp } from './tabelas-auxiliar/comp';

const routes: Routes = [
  {
    path: '',
    component: ManterComp,
    // resolve: { cidadePadrao: localResolverCidadePadrao },
  },
  {
    path: 'tabelas-auxiliares',
    component: AuxiliarManterComp,
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrativoRoutes { }
