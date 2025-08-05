import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComp } from './lista/comp';
import { NotFoundComponent } from '../../not-found';

// const localResolver: ResolveFn<Usuario> = route => {
//   return inject(LoadingSpinnerService).showUntilCompleted(inject(UsuarioService).recuperarPorId(+route.paramMap.get('id')!));
// };

const routes: Routes = [
  {
    path: '',
    component: ListComp,
  },
  // {
  //   path: 'manter',
  //   component: ManterComp,
  // },
  // {
  //   path: 'manter/:id',
  //   component: ManterComp,
  //   resolve: { entity: localResolver },
  // },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceberRoutes { }
