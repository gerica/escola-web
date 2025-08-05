import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../not-found';

// const localResolver: ResolveFn<Usuario> = route => {
//   return inject(LoadingSpinnerService).showUntilCompleted(inject(UsuarioService).recuperarPorId(+route.paramMap.get('id')!));
// };

const routes: Routes = [
{
    path: 'receber',
    loadChildren: () => import('./receber/receber.routes').then(m => m.ReceberRoutes),
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceiroRoutes { }
