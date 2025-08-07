import { inject, NgModule } from '@angular/core';
import { ResolveFn, RouterModule, Routes } from '@angular/router';
import { ListComp } from './lista/comp';
import { NotFoundComponent } from '../../not-found';
import { ContaReceberManterComp } from './manter/comp';
import Contrato from 'src/app/shared/models/contrato';
import { LoadingSpinnerService } from 'src/app/core/services';
import { ContratoService } from 'src/app/shared/services/contrato.service';

const localResolver: ResolveFn<Contrato> = route => {
  return inject(LoadingSpinnerService).showUntilCompleted(inject(ContratoService).recuperarPorId(+route.paramMap.get('id')!));
};

const routes: Routes = [
  {
    path: '',
    component: ListComp,
  },
  // {
  //   path: 'manter',
  //   component: ManterComp,
  // },
  {
    path: 'contrato/:id',
    component: ContaReceberManterComp,
    resolve: { entity: localResolver },
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceberRoutes { }
