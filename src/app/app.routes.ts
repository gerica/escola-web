import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { CompChangePass } from './mudarSenha/comp';
import { CompResetSenha } from './resetarSenha/comp';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'mudarSenha', component: CompChangePass },
    { path: 'resetarSenha', component: CompResetSenha },
    {
        path: '',
        // Se PagesModule contém componentes que não são standalone,
        // ou se você ainda quer lazy-load de um NgModule:
        loadChildren: () => import('./pages/pages.routes').then(m => m.routes),
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
    },
    // Se PagesComponent é standalone e você quer carregá-lo diretamente,
    // e seus filhos também são standalone, você pode fazer assim:
    // {
    //     path: '',
    //     component: PagesComponent, // Se PagesComponent for standalone
    //     children: [
    //         { path: 'inicio', component: HomeComponent },
    //         { path: '**', component: NotFoundComponent },
    //     ],
    //     canActivate: [AuthGuard], // Se você quiser proteger o layout PagesComponent
    // },
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: '**', redirectTo: '/inicio' } // Rota curinga para redirecionar usuários desconhecidos
];