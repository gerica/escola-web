import { inject, NgModule } from '@angular/core';
import { ResolveFn, RouterModule, Routes } from '@angular/router';
import { LoadingSpinnerService } from 'src/app/core/services';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { NotFoundComponent } from '../not-found';
import { ListComp } from './lista/comp';
import { ManterComp } from './manter/comp';

const localResolver: ResolveFn<Usuario> = route => {
  return inject(LoadingSpinnerService).showUntilCompleted(inject(UsuarioService).recuperarPorId(+route.paramMap.get('id')!));
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
export class CompRoutes { }
