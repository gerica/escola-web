import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import ClienteContato, { DELETE_CONTATO_BY_ID, FETCH_ALL_CONTATOS_BY_CLIENTE, FETCH_CONTATO_BY_ID, SAVE_CLIENTE_CONTATO } from '../models/cliente-contato';

@Injectable({ providedIn: 'root' })
export class ClienteContatoService {

  private apollo = inject(Apollo);

  salvar(idCliente: number, id: number | undefined, entity: Partial<ClienteContato>): Observable<ClienteContato> {
    return this.apollo.mutate<any>({
      mutation: SAVE_CLIENTE_CONTATO,
      variables: {
        request: {
          id: id || undefined,
          idCliente: idCliente,
          numero: entity.numero,
        }
      },
    }).pipe(
      map(result => result.data.saveClienteContato as ClienteContato),
      // tap(value => {
      //   console.log(value);
      // }),
    );
  }

  apagar(id: number): Observable<Boolean> {
    return this.apollo.mutate<any>({
      mutation: DELETE_CONTATO_BY_ID,
      variables: {
        id: id
      },
    }).pipe(
      map(result => result.data.deleteContatoById as Boolean),
      // tap(value => {
      //   console.log(value);
      // }),
    );
  }

  recuperarPorIdCliente(idCliente: number): Observable<ClienteContato[]> {
    return this.apollo.query<any>({
      query: FETCH_ALL_CONTATOS_BY_CLIENTE,
      variables: {
        id: idCliente
      },
      fetchPolicy: 'network-only', // Or 'no-cache'      
    }).pipe(
      map(result => result.data.fetchContatoByIdCliente as ClienteContato[]),
      // tap(value => {
      //   console.log("Received GraphQL data:", value);
      // }),
    );
  }

  recuperarPorId(id: number): Observable<ClienteContato> {
    // console.log("Sending GraphQL variables (fetchByIdCliente):", { id: id });
    return this.apollo.query<any>({
      query: FETCH_CONTATO_BY_ID,
      variables: {
        id: id // Pass the ID directly
      },
      fetchPolicy: 'network-only' // Use network-only or no-cache for individual fetches to ensure fresh data
    }).pipe(
      map(result => result.data.fetchByIdCliente as ClienteContato),
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