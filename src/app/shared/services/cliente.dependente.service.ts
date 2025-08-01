import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import ClienteDependente, { DELETE_DEPENDENTE_BY_ID, FETCH_ALL_DEPENDENTES_BY_CLIENTE, FETCH_DEPENDENTE_BY_ID, SAVE_CLIENTE_DEPENDENTE } from '../models/cliente-dependente';
import { DataUtils } from './data.service';
import { URL_ADMIN } from '../common/constants';

@Injectable({ providedIn: 'root' })
export class ClienteDependenteService {

  private apollo = inject(Apollo);

  salvar(idCliente: number, id: number | undefined, entity: Partial<ClienteDependente>): Observable<ClienteDependente> {
    return this.apollo.mutate<any>({
      mutation: SAVE_CLIENTE_DEPENDENTE,
      variables: {
        request: {
          id: id || undefined,
          idCliente: idCliente,
          nome: entity.nome,
          sexo: entity.sexo,
          docCPF: entity.docCPF,
          dataNascimento: DataUtils.formatDateToYYYYMMDD(entity.dataNascimento),
          parentesco: entity.parentesco,
        },
      },
      context: { uri: URL_ADMIN },
    }).pipe(
      map(result => result.data.saveClienteDependente as ClienteDependente),
      // tap(value => {
      //   console.log(value);
      // }),
    );
  }

  apagar(id: number): Observable<Boolean> {
    return this.apollo.mutate<any>({
      mutation: DELETE_DEPENDENTE_BY_ID,
      variables: {
        id: id
      },
      context: { uri: URL_ADMIN },
    }).pipe(
      map(result => result.data.deleteDependenteById as Boolean),
      // tap(value => {
      //   console.log(value);
      // }),
    );
  }

  recuperarPorIdCliente(idCliente: number): Observable<ClienteDependente[]> {
    return this.apollo.query<any>({
      query: FETCH_ALL_DEPENDENTES_BY_CLIENTE,
      variables: {
        id: idCliente
      },
      context: { uri: URL_ADMIN },
      fetchPolicy: 'network-only', // Or 'no-cache'      
    }).pipe(
      map(result => result.data.fetchDependenteByIdCliente as ClienteDependente[]),
      // tap(value => {
      //   console.log("Received GraphQL data:", value);
      // }),
    );
  }

  recuperarPorId(id: number): Observable<ClienteDependente> {
    // console.log("Sending GraphQL variables (fetchByIdCliente):", { id: id });
    return this.apollo.query<any>({
      query: FETCH_DEPENDENTE_BY_ID,
      variables: {
        id: id // Pass the ID directly
      }, 
      context: { uri: URL_ADMIN },
      fetchPolicy: 'cache-first'
    }).pipe(
      map(result => result.data.fetchByIdCliente as ClienteDependente),
      // tap(value => {
      //   console.log("Received GraphQL data (fetchByIdCliente):", value);
      // })
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