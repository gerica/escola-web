import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Page, PageRequest } from 'src/app/core/models';
import { URL_ADMIN } from '../common/constants';
import { Cargo, DELETE_CARGO_BY_ID, FETCH_ALL_CARGOS, SAVE_CARGO } from '../models/cargo';


@Injectable({ providedIn: 'root' })
export class CargoService {

    private apollo = inject(Apollo);

    buscarCargo(filtro: string, pageRequest: PageRequest): Observable<Page<Cargo>> {
        return this.apollo.query<any>({
            query: FETCH_ALL_CARGOS,
            variables: {
                filtro: filtro,
                page: pageRequest.page,
                size: pageRequest.size,
                sort: pageRequest.sorts || [],
            },
            context: { uri: URL_ADMIN },
            fetchPolicy: 'network-only', // Or 'cache-first' network-only
        }).pipe(
            map(result => result.data.fetchAllCargos as Page<Cargo>),
            // tap(value => {
            //     console.log("Received GraphQL data:", value);
            // }),
        );
    }

    salvarCargo(entity: Partial<Cargo>): Observable<Cargo> {
        return this.apollo.mutate<any>({
            mutation: SAVE_CARGO,
            variables: {
                request: {
                    id: entity.id || undefined,
                    nome: entity.nome,
                    descricao: entity.descricao,
                    ativo: entity.ativo,
                },
            },
            context: { uri: URL_ADMIN },
        }).pipe(
            map(result => result.data.saveCargo as Cargo),
            // tap(value => {
            //   console.log(value);
            // }),
        );
    }
    
    removerCargo(id: number): Observable<String> {
        return this.apollo.mutate<any>({
            mutation: DELETE_CARGO_BY_ID,
            variables: {
                id: id
            },
            context: { uri: URL_ADMIN },
        }).pipe(
            map(result => result.data.deleteCargoById as String),
            // tap(value => {
            //     console.log(value);
            // }),
        );
    }


}
