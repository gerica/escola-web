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
import { NgxMaskConfig, provideEnvironmentNgxMask, provideNgxMask } from 'ngx-mask';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlPtBr } from './core/mat-paginator-intl-ptBr';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt'; // This provides the locale data

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

// Register the locale data for pt-BR
registerLocaleData(localePt, 'pt-BR');

// Define your custom date formats for display and parsing
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY', // For date pickers
    timeInput: 'HH:mm',     // Essential for time pickers
  },
  display: {
    dateInput: 'DD/MM/YYYY', // For date pickers
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
    timeInput: 'HH:mm',     // Essential for time pickers
    timeOptionLabel: 'HH:mm', // Essential for time pickers' options
  },
};

export const MY_DATETIME_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY', // How the date is parsed from the input
    timeInput: 'HH:mm',     // Add this for parsing time from the input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // How the date is displayed in the input
    monthYearLabel: 'MMM YYYY', // e.g., "Jul 2025"
    dateA11yLabel: 'LL', // for accessibility
    monthYearA11yLabel: 'MMMM YYYY', // for accessibility
    timeInput: 'HH:mm',     // Add this for displaying time in the input
    timeOptionLabel: 'HH:mm', // Add this for displaying time options (e.g., in a dropdown)
  },
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
    provideNgxMask(),
    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'pt-BR' }, // Set Angular's global locale
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }, // Set Material Datepicker's locale
    { provide: MAT_DATE_FORMATS, useValue: MY_DATETIME_FORMATS }, // Apply custom date formats
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr },
    // Provedores para o Locale e Moeda
    { provide: LOCALE_ID, useValue: 'pt-BR' }, // Define o locale padrão para 'pt-BR'
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' } // Define a moeda padrão para 'BRL'
  ]
};