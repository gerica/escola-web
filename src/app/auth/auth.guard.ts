// src/app/guards/auth.guard.ts
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../core/services';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

    private authService = inject(AuthService);
    private router = inject(Router);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        return this.checkAuth(state.url);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        return this.checkAuth(state.url);
    }

    private checkAuth(returnUrl: string): boolean | UrlTree {        
        // console.log(this.authService.isAuthenticatedUser());
        if (this.authService.isAuthenticatedUser()) { // Supondo que você tenha um método para verificar a autenticação
            return true; // Usuário autenticado, permite o acesso à rota
        } else {
            // Usuário não autenticado, redireciona para a página de login            
            this.router.navigate(['/login'], { queryParams: { returnUrl } });
            return false;
        }
    }
}