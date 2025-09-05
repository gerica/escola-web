import { inject, NgModule } from '@angular/core';
import { ResolveFn, RouterModule, Routes } from '@angular/router';
import { LoadingSpinnerService } from 'src/app/core/services';
import { Empresa } from 'src/app/shared/models/empresa';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { EmpresaManterComp } from '../empresa/manter/comp';
import { NotFoundComponent } from '../not-found';
import { ParametroManterComp } from './parametro/comp';
import { AuxiliarManterComp } from './tabelas-auxiliar/comp';
import { CursoManterComp } from './tabelas-auxiliar/curso/comp';

const localResolver: ResolveFn<Empresa> = route => {
  return inject(LoadingSpinnerService).showUntilCompleted(inject(EmpresaService).recuperarPorId(+route.paramMap.get('id')!));
};

export const routes: Routes = [
  {
    path: 'parametros',
    component: ParametroManterComp,
    // resolve: { cidadePadrao: localResolverCidadePadrao },
  },
  {
    path: 'curso',
    component: CursoManterComp,
  },  
  {
    path: 'empresa/:id',
    component: EmpresaManterComp,
    resolve: { entity: localResolver },
  },
  {
    path: 'tabelas-auxiliares',
    component: AuxiliarManterComp,
  },
  { path: '**', component: NotFoundComponent },
];

