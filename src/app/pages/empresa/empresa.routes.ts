import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../not-found';
import { ListComp } from './lista/comp';
import { ManterComp } from './manter/comp';

// const localResolver: ResolveFn<Cliente> = route => {
//   return inject(LoadingSpinnerService).showUntilCompleted(inject(ClienteService).recuperarPorId(+route.paramMap.get('id')!));
// };

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
    // resolve: { entity: localResolver },
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpresaRoutes { }
