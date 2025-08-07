import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Page, PageRequest } from 'src/app/core/models';
import { URL_ADMIN } from '../common/constants';
import { DELETE_TURMA_BY_ID, FETCH_ALL_TURMAS, FETCH_BY_ID, SAVE_TURMA, Turma } from '../models/turma';
import { DataUtils } from './data.service';

@Injectable({ providedIn: 'root' })
export class TurmaService {

    private apollo = inject(Apollo);

    buscarTurma(filtro: string, pageRequest: PageRequest): Observable<Page<Turma>> {
        return this.apollo.query<any>({
            query: FETCH_ALL_TURMAS,
            variables: {
                filtro: filtro,
                page: pageRequest.page,
                size: pageRequest.size,
                sort: pageRequest.sorts || [],
            },
            context: { uri: URL_ADMIN },
            fetchPolicy: 'network-only', // Or 'cache-first' network-only
        }).pipe(
            map(result => result.data.fetchAllTurmas as Page<Turma>),
        );
    }

    salvarTurma(entity: Partial<Turma>): Observable<Turma> {
        return this.apollo.mutate<any>({
            mutation: SAVE_TURMA,
            variables: {
                request: {
                    id: entity.id || undefined,
                    idCurso: entity.curso?.id || undefined,
                    nome: entity.nome,
                    codigo: entity.codigo,
                    capacidadeMaxima: entity.capacidadeMaxima,
                    status: entity.status,
                    anoPeriodo: entity.anoPeriodo,
                    horarioInicio: DataUtils.formatTimeForGraphQL(entity.horarioInicio),
                    horarioFim: DataUtils.formatTimeForGraphQL(entity.horarioFim),
                    diasDaSemana: entity.diasDaSemana,
                    professor: entity.professor,
                    dataInicio: DataUtils.formatDateToYYYYMMDD(entity.dataInicio),
                    dataFim: DataUtils.formatDateToYYYYMMDD(entity.dataFim),
                },
            },
            context: { uri: URL_ADMIN },
        }).pipe(
            map(result => result.data.saveTurma as Turma),
            // tap(value => {
            //   console.log(value);
            // }),
        );
    }

    removerTurma(id: number): Observable<String> {
        return this.apollo.mutate<any>({
            mutation: DELETE_TURMA_BY_ID,
            variables: { id: id },
            context: { uri: URL_ADMIN },
        }).pipe(
            map(result => result.data.deleteTurmaById as String),
            // tap(value => {
            //     console.log(value);
            // }),
        );
    }

    recuperarPorId(id: number): Observable<Turma> {
        return this.apollo.query<any>({
            query: FETCH_BY_ID,
            variables: { id: id },
            context: { uri: URL_ADMIN },
            fetchPolicy: 'cache-first'
        }).pipe(
            map(result => result.data.fetchByIdTurma as Turma),
            // tap(value => {
            //   console.log("Received GraphQL data (fetchByIdCliente):", value);
            // }),
            // map(result => result)
        );
    }

}
