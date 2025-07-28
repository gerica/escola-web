import { inject, NgModule } from '@angular/core';
import { ResolveFn, RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../not-found';
import { ManterComp } from './manter/comp';
import { AuxiliarManterComp } from './tabelas-auxiliar/comp';
import { CursoManterComp } from './tabelas-auxiliar/curso/comp';
import { TurmaManterComp } from './tabelas-auxiliar/turma/comp';
import { Empresa } from 'src/app/shared/models/empresa';
import { LoadingSpinnerService } from 'src/app/core/services';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { EmpresaManterComp } from '../empresa/manter/comp';

const localResolver: ResolveFn<Empresa> = route => {
  return inject(LoadingSpinnerService).showUntilCompleted(inject(EmpresaService).recuperarPorId(+route.paramMap.get('id')!));
};

const routes: Routes = [
  {
    path: '',
    component: ManterComp,
    // resolve: { cidadePadrao: localResolverCidadePadrao },
  },
  {
    path: 'curso',
    component: CursoManterComp,
  },
  {
    path: 'turma',
    component: TurmaManterComp,
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrativoRoutes { }
