import { inject, Injectable, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import { AppConfig, BuildInfo } from '../models';

const GET_APP_CONFIG = gql`
  query getAppConfig{
    getAppConfig{
      description
      name
      time
      version
    } 
  }
`;

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private apollo = inject(Apollo);
  private _config = signal<AppConfig | undefined>(undefined);

  // Signal público e somente leitura para ser consumido pela aplicação
  readonly config = this._config.asReadonly();

  getAppConfig(): Observable<AppConfig> {
    return this.apollo.query<{ getAppConfig: BuildInfo }>({
      query: GET_APP_CONFIG,
    }).pipe(
      map(result => ({
        buildInfo: result.data.getAppConfig
      })),
      tap(config => {
        this._config.set(config);
        // console.log('AppConfig loaded:', config);
      })
    );
  }
}
