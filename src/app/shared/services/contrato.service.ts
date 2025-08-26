import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import Contrato, { CARREGAR_CONTRATO, ContratoDocBase64, DOWNLOAD_DOC_CONTRATO, DOWNLOAD_LISTA_CONTRATOS, FETCH_ALL_CONTRATOS, FETCH_CONTRATO_BY_ID, FETCH_CONTRATO_BY_ID_MATRICULA, SAVE_CONTRATO, SAVE_CONTRATO_MODELO } from '../models/contrato';
import { Page, PageRequest } from 'src/app/core/models';
import { DataUtils } from './data.service';
import { URL_ADMIN } from '../common/constants';
import { StatusContrato } from '../models/status-contrato.enum';
import ArquivoBase64 from '../models/arquivo.base64';

@Injectable({ providedIn: 'root' })
export class ContratoService {

  private apollo = inject(Apollo);

  salvar(id: number | undefined, entity: Partial<Contrato>): Observable<Contrato> {
    return this.apollo.mutate<any>({
      mutation: SAVE_CONTRATO,
      variables: {
        request: {
          id: id || undefined,
          idCliente: entity.cliente?.id || entity.idCliente,
          numeroContrato: entity.numeroContrato,
          valorTotal: entity.valorTotal,
          desconto: entity.desconto,
          statusContrato: entity.statusContrato,
          descricao: entity.descricao,
          termosCondicoes: entity.termosCondicoes,
          periodoPagamento: entity.periodoPagamento,
          observacoes: entity.observacoes,
          dataInicio: DataUtils.formatDateToYYYYMMDD(entity.dataInicio),
          dataFim: DataUtils.formatDateToYYYYMMDD(entity.dataFim),
          dataProximoPagamento: DataUtils.formatDateToYYYYMMDD(entity.dataProximoPagamento),
          dataAssinatura: DataUtils.formatDateToISOStringWithMillisUTC(entity.dataAssinatura),
        },
      },
      context: { uri: URL_ADMIN },
    }).pipe(
      map(result => result.data.saveContrato as Contrato),
      // tap(value => {
      //   console.log(value);
      // }),
    );
  }

  salvarModelo(id: number | undefined, modelo: String): Observable<Contrato> {
    return this.apollo.mutate<any>({
      mutation: SAVE_CONTRATO_MODELO,
      variables: {
        request: {
          id: id || undefined,
          contratoDoc: modelo,
        },
      },
      context: { uri: URL_ADMIN },
    }).pipe(
      map(result => result.data.saveContratoModelo as Contrato),
    );
  }

  buscar(filtro: string, status: StatusContrato[], pageRequest: PageRequest): Observable<Page<Contrato>> {
    return this.apollo.query<any>({
      query: FETCH_ALL_CONTRATOS,
      variables: {
        filtro: filtro,
        status: status,
        page: pageRequest.page,
        size: pageRequest.size,
        sort: pageRequest.sorts || [],
      },
      context: { uri: URL_ADMIN },
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
      context: { uri: URL_ADMIN },
      fetchPolicy: 'cache-first'
    }).pipe(
      map(result => {
        const entity = result.data.fetchById as Contrato
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
      context: { uri: URL_ADMIN },
    }).pipe(
      map(result => result.data.parseContrato as Contrato),
      // tap(value => {
      //   console.log(value);
      // }),
    );
  }

  recuperarPorIdMatricula(idMatricula: number): Observable<Contrato> {
    return this.apollo.query<any>({
      query: FETCH_CONTRATO_BY_ID_MATRICULA,
      variables: { id: idMatricula },
      context: { uri: URL_ADMIN },
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => result.data.fetchContratoByIdMatricula as Contrato),
    );
  }

  downloadDocContrato(id: number): Observable<ContratoDocBase64> {
    return this.apollo.query<any>({
      query: DOWNLOAD_DOC_CONTRATO,
      variables: { id },
      context: { uri: URL_ADMIN },
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => result.data.downloadDocContrato),
    );
  }

  downloadFile(tipo: string, filtro: string): Observable<ArquivoBase64> {
    return this.apollo.query<any>({
      query: DOWNLOAD_LISTA_CONTRATOS,
      variables: {
        request: {
          filtro: filtro,
          tipo: tipo
        }
      },
      context: { uri: URL_ADMIN },
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => result.data.downloadListaContratos),
    );
  }

}
