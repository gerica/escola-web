import { Empresa } from 'src/app/shared/models/empresa';
import { UserRole } from './user-role.model';
import { gql } from 'apollo-angular';

export interface User {
  id: number,
  token: string;
  username: string;
  firstName: string;
  lastName?: string;
  roles?: UserRole[];
  precisaAlterarSenha?: boolean;
  empresa: Empresa;
}

export interface ImpersonationResponse {
  token: string;
  user: User;
}

export const LOGIN = gql`
  mutation authenticate($username: String!, $password: String!) {
    authenticate(request: {username: $username, password: $password}) {
        token
        username
        firstName
        lastName
        roles
        precisaAlterarSenha
        empresa{
          id
          nomeFantasia
          logoUrl
        }
    }
  }
`;

export const IMPERSONATE_USER_MUTATION = gql`
  mutation impersonateUser($id: ID!) { # $id: ID! means the id is a required ID type
    impersonateUser(id: $id) {
      token
      user {
        token
        username
        firstName
        lastName
        roles
        empresa{
          id
          nomeFantasia
          logo {
            mimeType
            conteudoBase64
          }
        }
      }
    }
  }
`;
