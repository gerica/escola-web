import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Page, PageRequest } from 'src/app/core/models';
import { URL_ADMIN } from '../common/constants';
import Cliente, { DELETE_BY_ID, DOWNLOAD_LISTA_CLIENTES, FETCH_ALL_ATIVOS_CLIENTES, FETCH_ALL_ATIVOS_CLIENTES_COM_DEPENDENTES, FETCH_ALL_CLIENTES, FETCH_CLIENTE_BY_ID, SAVE_CLIENTE } from '../models/cliente';
import { DataUtils } from './data.service';
import RelatorioBase64 from './relatorio.base64';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  private apollo = inject(Apollo);

  salvar(id: number | undefined, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.apollo.mutate<any>({
      mutation: SAVE_CLIENTE,
      variables: {
        request: {
          id: id || undefined,
          nome: cliente.nome,
          docCPF: cliente.docCPF,
          docRG: cliente.docRG,
          dataNascimento: DataUtils.formatDateToYYYYMMDD(cliente.dataNascimento),
          cidade: cliente.cidade?.descricao,
          codigoCidade: cliente.cidade?.codigo,
          uf: cliente.cidade?.uf,
          endereco: cliente.endereco,
          email: cliente.email,
          profissao: cliente.profissao,
          localTrabalho: cliente.localTrabalho,
          statusCliente: cliente.statusCliente
        },
      },
      context: { uri: URL_ADMIN },
    }).pipe(
      map(result => result.data.saveCliente as Cliente),
      // tap(value => {
      //   console.log(value);
      // }),
    );
  }

  buscar(filtro: string, pageRequest: PageRequest): Observable<Page<Cliente>> {
    return this.apollo.query<any>({
      query: FETCH_ALL_CLIENTES,
      variables: {
        filtro: filtro,
        page: pageRequest.page,
        size: pageRequest.size,
        sort: pageRequest.sorts || [],
      },
      context: { uri: URL_ADMIN },
      fetchPolicy: 'network-only', // Or 'no-cache'      
    }).pipe(
      map(result => result.data.fetchAllClientes as Page<Cliente>),
      // tap(value => {
      //   console.log("Received GraphQL data:", value);
      // }),
    );
  }

  buscarAtivos(filtro: string, pageRequest: PageRequest): Observable<Page<Cliente>> {
    return this.apollo.query<any>({
      query: FETCH_ALL_ATIVOS_CLIENTES,
      variables: {
        filtro: filtro,
        page: pageRequest.page,
        size: pageRequest.size,
        sort: pageRequest.sorts || [],
      },
      context: { uri: URL_ADMIN },
      fetchPolicy: 'network-only', // Or 'no-cache'      
    }).pipe(
      map(result => result.data.fetchAllClientesAtivos as Page<Cliente>),
      // tap(value => {
      //   console.log("Received GraphQL data:", value);
      // }),
      // map(values => values)
    );
  }

  buscarAtivosComDependentes(filtro: string, pageRequest: PageRequest): Observable<Page<Cliente>> {
    return this.apollo.query<any>({
      query: FETCH_ALL_ATIVOS_CLIENTES_COM_DEPENDENTES,
      variables: {
        filtro: filtro,
        page: pageRequest.page,
        size: pageRequest.size,
        sort: pageRequest.sorts || [],
      },
      context: { uri: URL_ADMIN },
      fetchPolicy: 'network-only', // Or 'no-cache'      
    }).pipe(
      map(result => result.data.fetchAllClientsByStatusAndFiltroWithDependents as Page<Cliente>),
      // map(value => {
      //   // console.log("Received GraphQL data:", value);
      //   const contentNovo: AlunoTurma[] = [];
      //   value.content.forEach(c => {
      //     c.dependentes.forEach((d: any) => {
      //       contentNovo.push({
      //         idCliente: c.id,
      //         idDependente: d.id,
      //         nome: d.nome
      //       });
      //     })
      //     contentNovo.push({
      //       idCliente: c.id,
      //       idDependente: null,
      //       nome: c.nome
      //     });
      //   })
      //   // console.log(contentNovo);
      //   return {
      //     ...value,
      //     content: contentNovo
      //   }
      // }),

    );
  }

  recuperarPorId(id: number): Observable<Cliente> {
    return this.apollo.query<any>({
      query: FETCH_CLIENTE_BY_ID,
      variables: {
        id: id // Pass the ID directly
      },
      context: { uri: URL_ADMIN },
      fetchPolicy: 'cache-first'
    }).pipe(
      map(result => {
        const entity = result.data.fetchByIdCliente as Cliente
        return {
          ...entity,
          cidade: {
            codigo: entity.codigoCidade,
            descricao: entity.cidadeDesc,
            uf: entity.uf,
            estado: entity.uf
          }
        }
      }),
      // tap(value => {
      //   console.log("Received GraphQL data (fetchByIdCliente):", value);
      // }),
      // map(result => result)
    );
  }

  remover(id: number): Observable<String> {
    return this.apollo.mutate<any>({
      mutation: DELETE_BY_ID,
      variables: { id: id },
      context: { uri: URL_ADMIN },
    }).pipe(
      map(result => result.data.deleteCursoById as String),
    );
  }

  downloadFile(tipo: string, filtro: string): Observable<RelatorioBase64> {
    return this.apollo.query<any>({
      query: DOWNLOAD_LISTA_CLIENTES,
      variables: {
        request: {
          filtro: filtro,
          tipo: tipo
        }
      },
      context: { uri: URL_ADMIN },
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => result.data.downloadListaClientes),
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