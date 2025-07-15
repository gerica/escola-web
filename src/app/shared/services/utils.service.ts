import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Page, PageRequest } from 'src/app/core/models';
import { Cidade } from '../models/cidade';
import { FETCH_CIDADE_BY_CODIGO, FETCH_CIDADE_BY_FILTRO } from '../models/utils';

const URL = '/utils/graphql';

@Injectable({ providedIn: 'root' })
export class UtilsService {
    private apollo = inject(Apollo);

    recuperarPorFiltro(filtro: string, pageRequest: PageRequest): Observable<Page<Cidade>> {
        return this.apollo.query<any>({
            query: FETCH_CIDADE_BY_FILTRO,
            variables: {
                filtro: filtro,
                page: pageRequest.page,
                size: pageRequest.size,
                sort: pageRequest.sorts || [],
            },
            context: {
                uri: URL
            },
            fetchPolicy: 'network-only', // Or 'no-cache'      
        }).pipe(
            map(result => result.data.fetchByFiltro as Page<Cidade>),
            // tap(value => {
            //   console.log("Received GraphQL data:", value);
            // }),
        );
    }

    recuperarPorCodigo(codigo: String): Observable<Cidade> {
        return this.apollo.query<any>({
            query: FETCH_CIDADE_BY_CODIGO,
            variables: { codigo: codigo },
            context: { uri: URL },
            fetchPolicy: 'network-only', // Or 'no-cache'      
        }).pipe(
            map(result => result.data.fetchMunicipioCodigo as Cidade),
            // tap(value => {
            //   console.log("Received GraphQL data:", value);
            // }),
        );
    }

}
