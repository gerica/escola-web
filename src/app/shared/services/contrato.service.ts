import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import Contrato, { CARREGAR_CONTRATO, FETCH_ALL_CONTRATOS, FETCH_CONTRATO_BY_ID, SAVE_CONTRATO } from '../models/contrato';
import { Page, PageRequest } from 'src/app/core/models';
import { DataUtils } from './data.service';

const URL = '/clients/graphql';

@Injectable({ providedIn: 'root' })
export class ContratoService {


  private apollo = inject(Apollo);

  salvar(id: number | undefined, entity: Partial<Contrato>): Observable<Contrato> {
    return this.apollo.mutate<any>({
      mutation: SAVE_CONTRATO,
      variables: {
        request: {
          idContrato: id || undefined,
          idCliente: entity.cliente?.id || entity.idCliente,
          numeroContrato: entity.numeroContrato,
          valorTotal: entity.valorTotal,
          statusContrato: entity.statusContrato,
          descricao: entity.descricao,
          termosCondicoes: entity.termosCondicoes,
          periodoPagamento: entity.periodoPagamento,
          observacoes: entity.observacoes,
          contratoDoc: entity.contratoDoc,
          dataInicio: DataUtils.formatDateToYYYYMMDD(entity.dataInicio),
          dataFim: DataUtils.formatDateToYYYYMMDD(entity.dataInicio),
          dataProximoPagamento: DataUtils.formatDateToYYYYMMDD(entity.dataProximoPagamento),
        },
      },
      context: {
        uri: URL
      },
    }).pipe(
      map(result => result.data.saveContrato as Contrato),
      // tap(value => {
      //   console.log(value);
      // }),
    );
  }

  buscar(filtro: string, pageRequest: PageRequest): Observable<Page<Contrato>> {
    return this.apollo.query<any>({
      query: FETCH_ALL_CONTRATOS,
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
      map(result => result.data.fetchAllContratos as Page<Contrato>),
      // tap(value => {
      //   console.log("Received GraphQL data:", value);
      // }),
    );
  }

  recuperarPorId(id: number): Observable<Contrato> {
    return this.apollo.query<any>({
      query: FETCH_CONTRATO_BY_ID,
      variables: {
        id: id // Pass the ID directly
      },
      context: {
        uri: URL
      },
      fetchPolicy: 'cache-first'
    }).pipe(
      map(result => {
        const entity = result.data.fetchByIdContrato as Contrato
        return {
          ...entity,
        }
      }),
      // tap(value => {
      //   console.log("Received GraphQL data (fetchByIdCliente):", value);
      // }),
      // map(result => result)
    );
  }

  carregarContrato(id: number): Observable<Contrato> {
    return this.apollo.mutate<any>({
      mutation: CARREGAR_CONTRATO,
      variables: {
        id: id
      },
      context: {
        uri: URL
      },
    }).pipe(
      map(result => result.data.parseContrato as Contrato),
      // tap(value => {
      //   console.log(value);
      // }),
    );
  }
}
