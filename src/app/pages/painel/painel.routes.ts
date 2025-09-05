import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../not-found';
import { PainelFinanceiroComp } from './financeiro/comp';

// const localResolver: ResolveFn<Usuario> = route => {
//   return inject(LoadingSpinnerService).showUntilCompleted(inject(UsuarioService).recuperarPorId(+route.paramMap.get('id')!));
// };

const routes: Routes = [
{
    path: 'financeiro',
    component: PainelFinanceiroComp
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PainelRoutes { }
