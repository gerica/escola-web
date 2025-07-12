import { InjectionToken, Signal } from '@angular/core';
import { BuildInfo } from '../../shared/models/build-info.model';

export interface AppConfig {
  buildInfo: BuildInfo;
}


export const APP_CONFIG = new InjectionToken<Signal<AppConfig>>('APP_CONFIG');

export const APP_TOKEN = new InjectionToken<Signal<string | null>>('APP_TOKEN');
