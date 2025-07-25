import { InjectionToken, Signal } from '@angular/core';
import { BuildInfo } from '../../shared/models/build-info.model';
import { Usuario } from 'src/app/shared/models/usuario';

export interface AppConfig {
  buildInfo: BuildInfo;
}

export const APP_CONFIG = new InjectionToken<Signal<AppConfig>>('APP_CONFIG');

export const APP_TOKEN = new InjectionToken<Signal<string | null>>('APP_TOKEN');

export const APP_USER = new InjectionToken<Signal<Usuario | null>>('APP_USER');
