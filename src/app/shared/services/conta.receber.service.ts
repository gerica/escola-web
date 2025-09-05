import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { URL_ADMIN } from '../common/constants';
import { ContaReceber, ContaReceberResumoPorMes, CRIAR_CONTA_RECEBER, DELETE_CONTA_RECEBER_BY_ID, FETCH_ALL_CONTAS_RECEBER_BY_CONTRATO, FETCH_RESUMO_BY_MES, SAVE_CONTA_RECEBER } from '../models/conta-receber';
import { Page, PageRequest } from 'src/app/core/models';
import { DataUtils } from './data.service';

@Injectable({ providedIn: 'root' })
export class ContaReceberService {


  private apollo = inject(Apollo);

  criar(idContrato: number): Observable<String> {
    return this.apollo.mutate<any>({
      mutation: CRIAR_CONTA_RECEBER,
      variables: {
        idContrato,
      },
      context: { uri: URL_ADMIN },
    }).pipe(
      map(result => result.data.criarContasReceber as String),
      // tap(value => {
      //   console.log(value);
      // }),
    );
  }

  salvar(entity: Partial<ContaReceber>, idContrato: number): Observable<String> {
    return this.apollo.mutate<any>({
      mutation: SAVE_CONTA_RECEBER,
      variables: {
        request: {
          id: entity.id || undefined,
          idContrato: idContrato,
          valorTotal: entity.valorTotal !== null ? parseFloat(entity.valorTotal as any) : null,
          desconto: entity.desconto !== null ? parseFloat(entity.desconto as any) : null,
          status: entity.status,
          valorPago: entity.valorPago !== null ? parseFloat(entity.valorPago as any) : null,
          dataVencimento: entity.dataVencimento != null ? DataUtils.formatDateToYYYYMMDD(entity.dataVencimento) : null,
          dataPagamento: entity.dataPagamento != null ? DataUtils.formatDateToYYYYMMDD(entity.dataPagamento) : null,
          observacoes: entity.observacoes
        },
      },
      context: { uri: URL_ADMIN },
    }).pipe(
      map(result => result.data.saveContaReceber as String),
      // tap(value => {
      //   console.log(value);
      // }),
    );
  }

  buscar(idContrato: number): Observable<ContaReceber[]> {
    return this.apollo.query<any>({
      query: FETCH_ALL_CONTAS_RECEBER_BY_CONTRATO,
      variables: {
        idContrato
      },
      context: { uri: URL_ADMIN },
      fetchPolicy: 'network-only', // Or 'no-cache'      
    }).pipe(
      map(result => result.data.fetchAllContasReceber as ContaReceber[]),
      // tap(value => {
      //   console.log("Received GraphQL data:", value);
      // }),
    );
  }

  // recuperarPorId(id: number): Observable<Contrato> {
  //   return this.apollo.query<any>({
  //     query: FETCH_CONTRATO_BY_ID,
  //     variables: {
  //       id: id // Pass the ID directly
  //     },
  //     context: { uri: URL_ADMIN },
  //     fetchPolicy: 'cache-first'
  //   }).pipe(
  //     map(result => {
  //       const entity = result.data.fetchById as Contrato
  //       return {
  //         ...entity,
  //       }
  //     }),
  //     // tap(value => {
  //     //   console.log("Received GraphQL data (fetchByIdCliente):", value);
  //     // }),
  //     // map(result => result)
  //   );
  // }

  // carregarContrato(id: number): Observable<Contrato> {
  //   return this.apollo.mutate<any>({
  //     mutation: CARREGAR_CONTRATO,
  //     variables: {
  //       id: id
  //     },
  //     context: { uri: URL_ADMIN },
  //   }).pipe(
  //     map(result => result.data.parseContrato as Contrato),
  //     // tap(value => {
  //     //   console.log(value);
  //     // }),
  //   );
  // }

  remover(id: number): Observable<String> {
    return this.apollo.mutate<any>({
      mutation: DELETE_CONTA_RECEBER_BY_ID,
      variables: {
        id: id
      },
      context: { uri: URL_ADMIN },
    }).pipe(
      map(result => result.data.apagarContaReceber as String),
      // tap(value => {
      //     console.log(value);
      // }),
    );
  }

  fetchResumoPorMes(dataRererencia: Date): Observable<ContaReceberResumoPorMes> {
    return this.apollo.query<any>({
      query: FETCH_RESUMO_BY_MES,
      variables: {
        dataRef: DataUtils.formatDateToYYYYMMDD(dataRererencia),
      },
      context: { uri: URL_ADMIN },
      fetchPolicy: 'network-only', // Or 'no-cache'      
    }).pipe(
      map(result => result.data.fetchResumoByMes as ContaReceberResumoPorMes),
      // tap(value => {
      //     console.log(value);
      // }),
    );
  }
}
