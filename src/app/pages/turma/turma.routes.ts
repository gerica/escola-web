import { inject, NgModule } from '@angular/core';
import { ResolveFn, RouterModule, Routes } from '@angular/router';
import { LoadingSpinnerService } from 'src/app/core/services';
import { Turma } from 'src/app/shared/models/turma';
import { TurmaService } from 'src/app/shared/services/turma.service';
import { NotFoundComponent } from '../not-found';
import { ListComp } from './lista/comp';
import { ManterComp } from './manter/comp';


const localResolver: ResolveFn<Turma> = route => {
  return inject(LoadingSpinnerService).showUntilCompleted(inject(TurmaService).recuperarPorId(+route.paramMap.get('id')!));
};

const routes: Routes = [
  {
    path: '',
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
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TurmaRoutes { }
