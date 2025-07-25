import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, DEFAULT_CURRENCY_CODE, inject, LOCALE_ID, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { InMemoryCache, Operation } from '@apollo/client/core';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { routes } from './app.routes';
import { AuthGuard } from './auth/auth.guard';
import { APP_CONFIG, APP_TOKEN, APP_USER } from './core/models';
import { AuthService } from './core/services';
import { AppConfigService } from './core/services/app.config.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { NgxMaskConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlPtBr } from './core/mat-paginator-intl-ptBr';

const maskConfigFunction: () => Partial<NgxMaskConfig> = () => {
  return {
    validation: false,
  };
};


const createApollo = (httpLink: HttpLink) => {
  return {
    cache: new InMemoryCache(),
    link: httpLink.create({
      uri: (operation: Operation) => {
        const context = operation.getContext();
        // Usa a URI do contexto se ela existir, senão, usa a padrão.
        return context['uri'] || '/graphql';
      },
    }),
  };
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // <-- Use suas rotas aqui!
    provideHttpClient(withInterceptors([authInterceptor])),
    provideEnvironmentNgxMask(maskConfigFunction),

    // Provedores para AuthGuard, AuthService, Apollo, etc.
    // Se AuthGuard e AuthService não são standalone e não usam provideIn: 'root',
    // ou se você quer garantir que eles sejam fornecidos aqui:
    AuthGuard,
    AuthService,
    AppConfigService,

    // Configuração do Apollo Client
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
    Apollo,
    provideAppInitializer(() => inject(AppConfigService).getAppConfig()),
    {
      provide: APP_CONFIG,
      useFactory: () => inject(AppConfigService).config,
      // deps: [AppConfigService],
    },
    {
      provide: APP_TOKEN,
      useFactory: () => inject(AuthService).token,
    },
    {
      provide: APP_USER,
      useFactory: () => inject(AuthService).loggedUser,
    },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr },
    // Provedores para o Locale e Moeda
    { provide: LOCALE_ID, useValue: 'pt-BR' }, // Define o locale padrão para 'pt-BR'
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' } // Define a moeda padrão para 'BRL'
  ]
};