import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Page, PageRequest } from 'src/app/core/models';
import { URL_ADMIN } from '../common/constants';
import { DELETE_BY_ID, FETCH_ALL, FETCH_BY_ID, Matricula, SAVE } from '../models/matricula';

@Injectable({ providedIn: 'root' })
export class MatriculaService {

    private apollo = inject(Apollo);

    buscar(idTurma: number, pageRequest: PageRequest): Observable<Page<Matricula>> {
        return this.apollo.query<any>({
            query: FETCH_ALL,
            variables: {
                idTurma: idTurma,
                page: pageRequest.page,
                size: pageRequest.size,
                sort: pageRequest.sorts || [],
            },
            context: { uri: URL_ADMIN },
            fetchPolicy: 'network-only', // Or 'cache-first' network-only
        }).pipe(
            map(result => result.data.fetchAllMatriculas as Page<Matricula>),
        );
    }

    salvar(entity: Partial<Matricula>): Observable<Matricula> {
        return this.apollo.mutate<any>({
            mutation: SAVE,
            variables: {
                request: {
                    id: entity.id || undefined,
                    idTurma: entity.turma?.id,
                    idCliente: entity.cliente ? entity.cliente.id : null,
                    idClienteDependente: entity.clienteDependente ? entity.clienteDependente.id : null,
                    status: entity.status,
                    observacoes: entity.observacoes
                },
            },
            context: { uri: URL_ADMIN },
        }).pipe(
            map(result => result.data.saveTurma as Matricula),
            // tap(value => {
            //   console.log(value);
            // }),
        );
    }

    remover(id: number): Observable<String> {
        return this.apollo.mutate<any>({
            mutation: DELETE_BY_ID,
            variables: { id: id },
            context: { uri: URL_ADMIN },
        }).pipe(
            map(result => result.data.deleteMatriculaById as String),
            // tap(value => {
            //     console.log(value);
            // }),
        );
    }

    recuperarPorId(id: number): Observable<Matricula> {
        return this.apollo.query<any>({
            query: FETCH_BY_ID,
            variables: { id: id },
            context: { uri: URL_ADMIN },
            fetchPolicy: 'cache-first'
        }).pipe(
            map(result => result.data.fetchByIdMatricula as Matricula),
            // tap(value => {
            //   console.log("Received GraphQL data (fetchByIdCliente):", value);
            // }),
            // map(result => result)
        );
    }

}
