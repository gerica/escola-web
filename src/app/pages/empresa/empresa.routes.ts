import { inject, NgModule } from '@angular/core';
import { ResolveFn, RouterModule, Routes } from '@angular/router';
import { LoadingSpinnerService } from 'src/app/core/services';
import { Empresa } from 'src/app/shared/models/empresa';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { NotFoundComponent } from '../not-found';
import { ListComp } from './lista/comp';
import { EmpresaManterComp } from './manter/comp';

const localResolver: ResolveFn<Empresa> = route => {
  return inject(LoadingSpinnerService).showUntilCompleted(inject(EmpresaService).recuperarPorId(+route.paramMap.get('id')!));
};

export const routes: Routes = [
  {
    path: '',
    component: ListComp,
  },
  {
    path: 'manter',
    component: EmpresaManterComp,
  },
  {
    path: 'manter/:id',
    component: EmpresaManterComp,
    resolve: { entity: localResolver },
  },
  { path: '**', component: NotFoundComponent },
];