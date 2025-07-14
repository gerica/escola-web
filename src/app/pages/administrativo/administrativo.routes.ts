import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import Cliente from 'src/app/shared/models/cliente';
// import { ClienteService } from 'src/app/shared/services/cliente.service';
import { NotFoundComponent } from '../not-found';
import { ManterComp } from './manter/comp';

// const localResolver: ResolveFn<Cliente> = route => {
//   return inject(LoadingSpinnerService).showUntilCompleted(inject(ClienteService).recuperarPorId(+route.paramMap.get('id')!));
// };

const routes: Routes = [
  {
    path: '',
    component: ManterComp,
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrativoRoutes { }
