import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import Contrato, { FETCH_ALL_CONTRATOS, FETCH_CONTRATO_BY_ID, SAVE_CONTRATO }  from '../models/contrato';
import { Page, PageRequest } from 'src/app/core/models';

const URL = '/clients/graphql';

@Injectable({ providedIn: 'root' })
export class ContratoService {

  private apollo = inject(Apollo);

  salvar(id: number | undefined, cliente: Partial<Contrato>): Observable<Contrato> {    
    return this.apollo.mutate<any>({
      mutation: SAVE_CONTRATO,
      variables: {
        request: {
          id: id || undefined,
          // nome: cliente.nome,
          // docCPF: cliente.docCPF,
          // docRG: cliente.docRG,
          // dataNascimento: DataUtils.formatDateToYYYYMMDD(cliente.dataNascimento),
          // cidade: cliente.cidade?.descricao,
          // codigoCidade: cliente.cidade?.codigo,
          // uf: cliente.cidade?.uf,
          // endereco: cliente.endereco,
          // email: cliente.email,
          // profissao: cliente.profissao,
          // localTrabalho: cliente.localTrabalho,
          // statusCliente: cliente.statusCliente
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
    console.log('buscar cotnratos service');
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
      tap(value => {
        console.log("Received GraphQL data:", value);
      }),
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
      fetchPolicy: 'network-only' // Use network-only or no-cache for individual fetches to ensure fresh data
    }).pipe(
      map(result => {
        const entity = result.data.fetchByIdContrato as Contrato        
        return {
          ...entity,
          // cidade: {
          //   codigo: entity.codigoCidade,
          //   descricao: entity.cidadeDesc,
          //   uf: entity.uf,
          //   estado: entity.uf
          // }
        }
      }),
      // tap(value => {
      //   console.log("Received GraphQL data (fetchByIdCliente):", value);
      // }),
      // map(result => result)
    );
  }
}
