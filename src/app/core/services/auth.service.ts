import { inject, Injectable, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import { User } from '../models';
import { KEY_LOCAL_STORE_USUARIO, KEY_LOCAL_TOKEN } from 'src/app/shared/common/constants';

const LOGIN = gql`
  mutation authenticate($username: String!, $password: String!) {
    authenticate(request: {username: $username, password: $password}) {
        token
        username
        firstName
        lastName
        roles
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _loggedUser = signal<User | undefined>(undefined);
  private _token = signal<string | null>(null);

  loggedUser = this._loggedUser.asReadonly();
  token = this._token.asReadonly();

  setLoggedUser(user: User | undefined) {
    this._loggedUser.set(user);
  }

  private apollo = inject(Apollo);

  constructor() {
    // Ao iniciar o serviço, verifica se já existe um token no localStorage
    // para manter o usuário logado entre sessões/reloads.
    const userStr = localStorage.getItem(KEY_LOCAL_STORE_USUARIO);
    if (userStr) {
      const user = JSON.parse(userStr) as User;
      this.setLoggedUser(user);
    }
    const storedToken = localStorage.getItem(KEY_LOCAL_TOKEN);
    if (storedToken) {
      this._token.set(storedToken);
    }
  }

  // Exemplo simples: verifica a presença de um token JWT no localStorage
  isAuthenticatedUser(): boolean {
    const token = this.token();
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));      
      // O 'exp' é um timestamp em segundos, o Date.now() é em milissegundos.
      const isExpired = payload.exp * 1000 < Date.now();      

      if (isExpired) {
        this.logout(); // Limpa o token expirado
        return false;
      }

      return true;
    } catch (e) {
      // Se houver erro ao decodificar, o token é inválido.
      this.logout();
      return false;
    }
  }

  // Métodos para login e logout (exemplo)
  login(username: string, password: string): Observable<boolean> {
    return this.apollo.mutate<any>({
      mutation: LOGIN,
      variables: {
        username,
        password
      },
      context: {
        uri: '/admin/graphql'
      },
    }).pipe(
      map(result => result.data.authenticate as User),
      tap(user => {
        localStorage.setItem(KEY_LOCAL_STORE_USUARIO, JSON.stringify(user));
        localStorage.setItem(KEY_LOCAL_TOKEN, user.token);
        this.setLoggedUser(user);
        this._token.set(user.token);
      }),
      map(token => !!token) // Retorna true se o login foi bem-sucedido
    );
  }

  logout(): void {
    localStorage.removeItem(KEY_LOCAL_TOKEN);
    localStorage.removeItem(KEY_LOCAL_STORE_USUARIO);
    this._token.set(null);
    this.setLoggedUser(undefined);
  }
}
