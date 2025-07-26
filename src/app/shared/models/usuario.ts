import { gql } from "apollo-angular";
import { Empresa } from "./empresa";
import { UserRole } from "src/app/core/models";

export interface Usuario {
  id?: number; // Opcional, pois pode não existir em novas Usuarios antes de salvar
  // idEmpresa: number;
  empresa: Empresa;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  enabled: Boolean,
  roles: UserRole[];
  dataCadastro: Date
  dataAtualizacao: Date
}

const SAVE_USUARIO = gql`
  mutation saveUsuario($request: UsuarioRequest!){  
    saveUsuario(request:$request){
      id
      empresa {
        id
        nomeFantasia
      }
      username
      firstname
      lastname
      email
      enabled
      roles
    }
  }
`;

const FETCH_ALL_USUARIOS = gql`  
  query fetchAllUsuariosByFilter($filtro: String, $page: Int, $size: Int, $sort: [SortRequest]) { 
    fetchAllUsuariosByFilter(filtro: $filtro, page: $page, size: $size, sort: $sort) {    
      number
      size
      totalElements
      totalPages
      first
      last
      empty
      content {
        id
        empresa {
          id
          nomeFantasia
        }
        username
        firstname
        lastname
        email
        enabled
        roles
        dataCadastro
        dataAtualizacao

      }
    }
  }
`;

const FETCH_USUARIO_BY_ID = gql`
  query fetchByIdUsuario($id: ID!) { # $id: ID! means the id is a required ID type
    fetchByIdUsuario(id: $id) {
        id
        empresa {
          id
          nomeFantasia
        }
        username
        firstname
        lastname
        email
        enabled
        roles
    }
  }
`;

const FETCH_ALL_USUARIOS_BY_EMPRESA = gql`  
  query fetchAllUsuariosByFilterAndEmpresa($filtro: String, $idEmpresa: ID!, $page: Int, $size: Int, $sort: [SortRequest]) { 
    fetchAllUsuariosByFilterAndEmpresa(filtro: $filtro, idEmpresa: $idEmpresa, page: $page, size: $size, sort: $sort) {    
      number
      size
      totalElements
      totalPages
      first
      last
      empty
      content {
        id
        empresa {
          id
          nomeFantasia
        }
        username
        firstname
        lastname
        email
        enabled
        roles
        dataCadastro
        dataAtualizacao

      }
    }
  }
`;



export {
  SAVE_USUARIO,
  FETCH_ALL_USUARIOS,
  FETCH_USUARIO_BY_ID,
  FETCH_ALL_USUARIOS_BY_EMPRESA,
};