import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { URL_ADMIN } from '../common/constants';
import { ContaReceber, CRIAR_CONTA_RECEBER, DELETE_CONTA_RECEBER_BY_ID, FETCH_ALL_CONTAS_RECEBER_BY_CONTRATO } from '../models/conta-receber';
import { Page, PageRequest } from 'src/app/core/models';

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

  // salvarModelo(id: number | undefined, modelo: String): Observable<Contrato> {
  //   return this.apollo.mutate<any>({
  //     mutation: SAVE_CONTRATO_MODELO,
  //     variables: {
  //       request: {
  //         id: id || undefined,
  //         contratoDoc: modelo,
  //       },
  //     },
  //     context: { uri: URL_ADMIN },
  //   }).pipe(
  //     map(result => result.data.saveContratoModelo as Contrato),      
  //   );
  // }

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
}
