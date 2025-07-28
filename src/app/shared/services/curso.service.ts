import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Page, PageRequest } from 'src/app/core/models';
import { URL_ADMIN } from '../common/constants';
import { Curso, DELETE_CURSO_BY_ID, FETCH_ALL_CURSOS, SAVE_CURSO } from '../models/curso';

@Injectable({ providedIn: 'root' })
export class CursoService {

    private apollo = inject(Apollo);

    buscarCurso(filtro: string, pageRequest: PageRequest): Observable<Page<Curso>> {
        return this.apollo.query<any>({
            query: FETCH_ALL_CURSOS,
            variables: {
                filtro: filtro,
                page: pageRequest.page,
                size: pageRequest.size,
                sort: pageRequest.sorts || [],
            },
            context: { uri: URL_ADMIN },
            fetchPolicy: 'network-only', // Or 'cache-first' network-only
        }).pipe(
            map(result => result.data.fetchAllCursos as Page<Curso>),
        );
    }

    salvarCurso(entity: Partial<Curso>): Observable<Curso> {
        return this.apollo.mutate<any>({
            mutation: SAVE_CURSO,
            variables: {
                request: {
                    id: entity.id || undefined,
                    nome: entity.nome,
                    descricao: entity.descricao,
                    ativo: entity.ativo,
                    duracao: entity.duracao,
                    categoria: entity.categoria,
                    valorMensalidade: parseFloat(entity.valorMensalidade as any)
                },
            },
            context: { uri: URL_ADMIN },
        }).pipe(
            map(result => result.data.saveCurso as Curso),
            // tap(value => {
            //   console.log(value);
            // }),
        );
    }

    removerCurso(id: number): Observable<String> {
        return this.apollo.mutate<any>({
            mutation: DELETE_CURSO_BY_ID,
            variables: {
                id: id
            },
            context: { uri: URL_ADMIN },
        }).pipe(
            map(result => result.data.deleteCursoById as String),
            // tap(value => {
            //     console.log(value);
            // }),
        );
    }

}
