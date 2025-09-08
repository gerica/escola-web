import { inject, Injectable, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import { KEY_LOCAL_STORE_USUARIO, KEY_LOCAL_TOKEN, KEY_SUPER_ADMIN_TOKEN, KEY_SUPER_ADMIN_USER, URL_ADMIN } from 'src/app/shared/common/constants';
import { IMPERSONATE_USER_MUTATION, ImpersonationResponse, LOGIN, Menu, MenuItem, User, UserRole } from '../models';
import { jwtDecode } from 'jwt-decode';


const CHANGE_PASSWORD = gql`
  mutation changePassword($newPassword: String!) {
    changePassword(newPassword: $newPassword)
  }
`;

const RESET_PASSWORD = gql`
  mutation resetPassword($email: String!) {
    resetPassword(email: $email)
  }
`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _loggedUser = signal<User | undefined>(undefined);
  private _token = signal<string | null>(null);
  private _menu = signal<MenuItem[]>([]);

  loggedUser = this._loggedUser.asReadonly();
  token = this._token.asReadonly();
  menu = this._menu.asReadonly();

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

  isUserAdmin() {
    const user = this.loggedUser();
    if (!user) return false;
    if (!user.roles) return false;

    return user?.roles.includes(UserRole.ADMIN_EMPRESA);
  }

  isPrimeiroAcesso(): boolean {
    const user = this.loggedUser();
    return user?.precisaAlterarSenha || false;
  }

  // Métodos para login e logout (exemplo)
  login(username: string, password: string): Observable<boolean> {
    return this.apollo.mutate<any>({
      mutation: LOGIN,
      variables: {
        username,
        password
      },
      context: { uri: URL_ADMIN },
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

  changePassword(newPassword: string): Observable<string> {
    return this.apollo.mutate<any>({
      mutation: CHANGE_PASSWORD,
      variables: {
        newPassword
      },
      context: { uri: URL_ADMIN },
    }).pipe(
      map(result => result.data.changePassword as string),
      tap(() => {
        const user = this.loggedUser();
        if (user) {
          const newUse = { ...user, precisaAlterarSenha: false }
          localStorage.setItem(KEY_LOCAL_STORE_USUARIO, JSON.stringify(newUse));
          this.setLoggedUser(newUse);
        }
        // this._token.set(user.token);
      }),

    );
  }

  resetPassword(email: string): Observable<string> {
    return this.apollo.mutate<any>({
      mutation: RESET_PASSWORD,
      variables: {
        email
      },
      context: { uri: URL_ADMIN },
    }).pipe(
      map(result => result.data.resetPassword as string),
      // tap((result) => {
      //   console.log(result);
      // }),
    );
  }

  impersonate(userId: number): Observable<boolean> {
    // 1. Salvar o token e o user original do SUPER_ADMIN        
    localStorage.setItem(KEY_SUPER_ADMIN_TOKEN, this.token() as string); // Guarda em segurança
    localStorage.setItem(KEY_SUPER_ADMIN_USER, JSON.stringify(this.loggedUser())); // Guarda em segurança

    return this.apollo.mutate<any>({
      mutation: IMPERSONATE_USER_MUTATION,
      variables: { id: userId },
      context: { uri: URL_ADMIN },
    }).pipe(
      map(result => result.data.impersonateUser as ImpersonationResponse),
      tap(impersonateUser => {
        localStorage.setItem(KEY_LOCAL_STORE_USUARIO, JSON.stringify(impersonateUser.user));
        localStorage.setItem(KEY_LOCAL_TOKEN, impersonateUser.token);
        this.setLoggedUser(impersonateUser.user);
        this._token.set(impersonateUser.token);
      }),
      map(impersonateUser => !!impersonateUser.token) // Retorna true se o login foi bem-sucedido
    );
  }

  isImpersonatedSession(): boolean {
    const token = this.token();
    if (!token) return false;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.is_impersonated === true;
    } catch (error) {
      return false;
    }
  }

  endImpersonation(): void {
    // 1. Pega o token original do SUPER_ADMIN que guardamos
    const superAdminToken = localStorage.getItem(KEY_SUPER_ADMIN_TOKEN);
    const superAdminUser = localStorage.getItem(KEY_SUPER_ADMIN_USER);

    if (superAdminToken) {
      // 2. Restaura o token original como o token ativo
      localStorage.setItem(KEY_LOCAL_STORE_USUARIO, superAdminUser as string);
      localStorage.setItem(KEY_LOCAL_TOKEN, superAdminToken);
      this.setLoggedUser(JSON.parse(superAdminUser as string));
      this._token.set(superAdminToken);

      // 3. Limpa o token de backup
      localStorage.removeItem(KEY_SUPER_ADMIN_TOKEN);
      localStorage.removeItem(KEY_SUPER_ADMIN_USER);
    } else {
      // Fallback: se algo deu errado, apenas faz logout
      this.logout();
    }
  }

  carregarMenu() {
    const user = this.loggedUser();
    this._menu.set(Menu.montarMenuPorPerfis(user?.roles));
  }

  logout(): void {
    localStorage.removeItem(KEY_LOCAL_TOKEN);
    localStorage.removeItem(KEY_LOCAL_STORE_USUARIO);
    localStorage.removeItem(KEY_SUPER_ADMIN_TOKEN);
    localStorage.removeItem(KEY_SUPER_ADMIN_USER);
    this._token.set(null);
    this.setLoggedUser(undefined);
  }

  isUsuarioTemPapel(rolesAProcurar: UserRole[]): boolean {
    // Acesso seguro aos papéis do usuário
    const userRoles = this.loggedUser()?.roles;

    // Se o usuário ou seus papéis não existirem, retorne false imediatamente.
    if (!userRoles || userRoles.length === 0) {
      return false;
    }

    // Verifica se pelo menos um dos papéis de `rolesAProcurar`
    // está presente em `userRoles`. Agora a comparação é segura e tipada.
    return rolesAProcurar.some(role => userRoles.includes(role));
  }
}
