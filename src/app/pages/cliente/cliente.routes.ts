import { inject, NgModule } from '@angular/core';
import { ResolveFn, RouterModule, Routes } from '@angular/router';
import { LoadingSpinnerService } from 'src/app/core/services';
import Cliente from 'src/app/shared/models/cliente';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { NotFoundComponent } from '../not-found';
import { ListComp } from './lista/comp';
import { ManterComp } from './manter/comp';

const localResolver: ResolveFn<Cliente> = route => {
  return inject(LoadingSpinnerService).showUntilCompleted(inject(ClienteService).recuperarPorId(+route.paramMap.get('id')!));
};

const routes: Routes = [
  {
    path: 'novo',
    component: ListComp,
  },
  {
    path: 'manter',
    component: ManterComp,
  },
  {
    path: 'manter/:id',
    component: ManterComp,
    resolve: { entity: localResolver },
  },
  {
    path: 'contrato',
    loadChildren: () => import('./contrato/contrato.routes').then(m => m.ContratoRoutes),
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClienteRoutes { }
