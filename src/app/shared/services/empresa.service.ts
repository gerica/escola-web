import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';

import { Page, PageRequest } from 'src/app/core/models';
import { DOWNLOAD_LISTA_EMPRESAS, Empresa, FETCH_ALL_EMPRESAS, FETCH_EMPRESA_BY_ID, SAVE_EMPRESA } from '../models/empresa';
import { URL_ADMIN } from '../common/constants';
import RelatorioBase64 from './relatorio.base64';


@Injectable({ providedIn: 'root' })
export class EmpresaService {


  private apollo = inject(Apollo);

  salvar(entity: Partial<Empresa>): Observable<Empresa> {
    return this.apollo.mutate<any>({
      mutation: SAVE_EMPRESA,
      variables: {
        request: {
          id: entity.id || undefined,
          nomeFantasia: entity.nomeFantasia,
          razaoSocial: entity.razaoSocial,
          cnpj: entity.cnpj,
          inscricaoEstadual: entity.inscricaoEstadual,
          telefone: entity.telefone,
          email: entity.email,
          endereco: entity.endereco,
          logoUrl: entity.logoUrl,
          ativo: entity.ativo,
        },
      },
      context: { uri: URL_ADMIN },
    }).pipe(
      map(result => result.data.saveEmpresa as Empresa),
      // tap(value => {
      //   console.log(value);
      // }),
    );
  }

  buscar(filtro: string, pageRequest: PageRequest): Observable<Page<Empresa>> {
    return this.apollo.query<any>({
      query: FETCH_ALL_EMPRESAS,
      variables: {
        filtro: filtro,
        page: pageRequest.page,
        size: pageRequest.size,
        sort: pageRequest.sorts || [],
      },
      context: { uri: URL_ADMIN },
      fetchPolicy: 'network-only', // Or 'no-cache'      
    }).pipe(
      map(result => result.data.fetchAllEmpresasByFilter as Page<Empresa>),
      // tap(value => {
      //   console.log("Received GraphQL data:", value);
      // }),
    );
  }

  recuperarPorId(id: number): Observable<Empresa> {
    return this.apollo.query<any>({
      query: FETCH_EMPRESA_BY_ID,
      variables: {
        id: id // Pass the ID directly
      },
      context: { uri: URL_ADMIN },
      fetchPolicy: 'cache-first'
    }).pipe(
      map(result => {
        const entity = result.data.fetchByIdEmpresa as Empresa
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


  downloadFile(tipo: string, filtro: string): Observable<RelatorioBase64> {
    return this.apollo.query<any>({
      query: DOWNLOAD_LISTA_EMPRESAS,
      variables: {
        request: {
          filtro: filtro,
          tipo: tipo
        }
      },
      context: { uri: URL_ADMIN },
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => result.data.downloadListaEmpesas),
    );
  }
}


// 2. Set fetchPolicy
// You can control how Apollo Client interacts with its cache using the fetchPolicy option in your query call.

// network-only: This policy always goes to the network and stores the result in the cache. If the network request fails, it will not fall back to the cache. Use this when you absolutely need the freshest data.

// no-cache: This policy always goes to the network but does not store the result in the cache. Use this if you never want to cache the results of a particular query. This is less common for paginated data, as caching can still be beneficial for performance if you navigate back and forth.

// cache-and-network: This policy immediately returns any data from the cache, then also sends a network request. Once the network request finishes, the cached data is updated, and the component is re-rendered with the fresh data. This gives a fast initial response while ensuring data is eventually up-to-date. This is often a good choice for lists where you want perceived speed but also accuracy.

// cache-first (Default): Checks cache first. If found, returns cache. Else, network request.

// cache-only: Only looks in the cache. Never makes a network request.