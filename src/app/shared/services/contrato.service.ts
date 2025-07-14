import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import Contrato, { GET_OUTRO_CONTRATO } from '../models/contrato';


@Injectable({ providedIn: 'root' })
export class ContratoService {

  private apollo = inject(Apollo);

  getOutroContrato(): Observable<string> {
    return this.apollo.query<{ getOutroContrato: string }>({
      query: GET_OUTRO_CONTRATO,
    }).pipe(
      map(result => result.data.getOutroContrato),
      tap(result => {
        console.debug('Value:', result);
      })
    );
  }

  salvar(id: number | undefined, contrato: Partial<Contrato>): Observable<any> {
    console.log(contrato);
    throw new Error('Method not implemented.');
  }
}
