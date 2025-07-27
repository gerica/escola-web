import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import { URL_ADMIN } from '../common/constants';
import { CHAVE_CONTRATO_CIDADE_PADRAO, CHAVE_CONTRATO_MODELO_PADRAO, FIND_BY_CHAVE, Parametro, SALVAR_PARAMETRO } from '../models/parametro';
import { Page, PageRequest } from 'src/app/core/models';
import { Cargo, FETCH_ALL_CARGOS, SAVE_CARGO } from '../models/cargo';


@Injectable({ providedIn: 'root' })
export class AdministrativoService {

    private apollo = inject(Apollo);

    findByChave(chave: string): Observable<Parametro> {
        return this.apollo.query<{ findByChave: Parametro }>({
            query: FIND_BY_CHAVE,
            variables: { chave },
            context: { uri: URL_ADMIN }
        }).pipe(
            map(result => result.data.findByChave),
            // tap(result => {
            //     console.log(result);
            // })
        );
    }

    salvarCidadePadrao(entity: Partial<Parametro>): Observable<Parametro> {
        return this.apollo.mutate<any>({
            mutation: SALVAR_PARAMETRO,
            variables: {
                request: {
                    chave: CHAVE_CONTRATO_CIDADE_PADRAO,
                    codigoMunicipio: entity.cidade?.codigo
                },

            },
            context: { uri: URL_ADMIN }
        }).pipe(map(result => result.data.salvarParametro as Parametro)
        );
    }

    salvarModeloContrato(entity: Partial<Parametro>): Observable<Parametro> {
        return this.apollo.mutate<any>({
            mutation: SALVAR_PARAMETRO,
            variables: {
                request: {
                    chave: CHAVE_CONTRATO_MODELO_PADRAO,
                    modeloContrato: entity.modeloContrato
                },
            },
            context: { uri: URL_ADMIN }
        }).pipe(map(result => result.data.salvarParametro as Parametro)
        );
    }

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

}
