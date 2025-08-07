// import { FetchPolicy } from '@apollo/client'; // Importe o FetchPolicy

export const TYPE_SUCCESS = 'success';
export const TYPE_DANGER = 'danger';
export const TYPE_WARNING = 'warning';

const NAME_APP = 'ESCOLA_';
export const KEY_LOCAL_STORE_USUARIO = `${NAME_APP}USUARIO`;
export const KEY_LOCAL_TOKEN = `${NAME_APP}TOKEN`;
export const KEY_LOCAL_STORE_ESTADOS = `${NAME_APP}ESTADOS`;
export const KEY_LOCAL_STORE_CIDADES = `${NAME_APP}CIDADES`;
export const KEY_SUPER_ADMIN_USER = `${NAME_APP}SUPER_ADMIN_USER`;
export const KEY_SUPER_ADMIN_TOKEN = `${NAME_APP}SUPER_ADMIN_TOKEN`;

export const URL_ADMIN = '/admin/graphql';

// You can control how Apollo Client interacts with its cache using the fetchPolicy option in your query call.
// export const POLICY_NETWORK_ONLY: FetchPolicy = 'network-only';
// export const POLICY_NO_CACHE: FetchPolicy = 'no-cache';
// // export const POLICY_CACHE_AND_NETWORK: WatchQueryFetchPolicy = 'cache-and-network';
// export const POLICY_CACHE_FIRST: FetchPolicy = 'cache-first';
// export const POLICY_CACHE_ONLY: FetchPolicy = 'cache-only';
//
// network-only: This policy always goes to the network and stores the result in the cache. If the network request fails, it will not fall back to the cache. Use this when you absolutely need the freshest data.
// no-cache: This policy always goes to the network but does not store the result in the cache. Use this if you never want to cache the results of a particular query. This is less common for paginated data, as caching can still be beneficial for performance if you navigate back and forth.
// cache-and-network: This policy immediately returns any data from the cache, then also sends a network request. Once the network request finishes, the cached data is updated, and the component is re-rendered with the fresh data. This gives a fast initial response while ensuring data is eventually up-to-date. This is often a good choice for lists where you want perceived speed but also accuracy.
// cache-first (Default): Checks cache first. If found, returns cache. Else, network request.
// cache-only: Only looks in the cache. Never makes a network request.

export const TYPE_PDF = 'pdf';
export const TYPE_CSV = 'csv';


export const MSG_SUCESS = 'Operação realizada com sucesso.';