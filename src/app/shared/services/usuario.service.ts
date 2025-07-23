import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';

import { Page, PageRequest } from 'src/app/core/models';
import { Usuario, FETCH_ALL_USUARIOS, FETCH_USUARIO_BY_ID, SAVE_USUARIO } from '../models/usuario';

const URL = '/admin/graphql';
@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private apollo = inject(Apollo);

  salvar(entity: Partial<Usuario>): Observable<Usuario> {
    return this.apollo.mutate<any>({
      mutation: SAVE_USUARIO,
      variables: {
        request: {
          id: entity.id || undefined,
          idEmpresa: entity.empresa?.id,
          username: entity.username,
          password: entity.password,
          firstname: entity.firstname,
          lastname: entity.lastname,
          email: entity.email,
          enabled: entity.enabled,
          roles: entity.roles
        },
      },
      context: {
        uri: URL
      },
    }).pipe(
      map(result => result.data.saveUsuario as Usuario),
      // tap(value => {
      //   console.log(value);
      // }),
    );
  }

  buscar(filtro: string, pageRequest: PageRequest): Observable<Page<Usuario>> {
    return this.apollo.query<any>({
      query: FETCH_ALL_USUARIOS,
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
      map(result => result.data.fetchAllUsuariosByFilter as Page<Usuario>),
      // tap(value => {
      //   console.log("Received GraphQL data:", value);
      // }),
    );
  }

  recuperarPorId(id: number): Observable<Usuario> {
    return this.apollo.query<any>({
      query: FETCH_USUARIO_BY_ID,
      variables: {
        id: id // Pass the ID directly
      },
      context: {
        uri: URL
      },
      fetchPolicy: 'network-only' // Use network-only or no-cache for individual fetches to ensure fresh data
    }).pipe(
      map(result => {
        const entity = result.data.fetchByIdUsuario as Usuario
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
}


// 2. Set fetchPolicy
// You can control how Apollo Client interacts with its cache using the fetchPolicy option in your query call.

// network-only: This policy always goes to the network and stores the result in the cache. If the network request fails, it will not fall back to the cache. Use this when you absolutely need the freshest data.

// no-cache: This policy always goes to the network but does not store the result in the cache. Use this if you never want to cache the results of a particular query. This is less common for paginated data, as caching can still be beneficial for performance if you navigate back and forth.

// cache-and-network: This policy immediately returns any data from the cache, then also sends a network request. Once the network request finishes, the cached data is updated, and the component is re-rendered with the fresh data. This gives a fast initial response while ensuring data is eventually up-to-date. This is often a good choice for lists where you want perceived speed but also accuracy.

// cache-first (Default): Checks cache first. If found, returns cache. Else, network request.

// cache-only: Only looks in the cache. Never makes a network request.