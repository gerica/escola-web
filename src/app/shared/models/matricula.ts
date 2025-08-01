import { gql } from "apollo-angular";
import Cliente from "./cliente";
import ClienteDependente from "./cliente-dependente";
import { StatusMatricula } from "./status-matricula.enum";
import { Turma } from "./turma";

export interface Matricula {
  id: number,
  codigo: String,
  turma: Turma,
  cliente: Cliente,
  clienteDependente: ClienteDependente,
  status: StatusMatricula,
  observacoes: string,
  dataCadastro: Date,
  dataAtualizacao: Date, // Data e hora da última atualização do registro
}

export interface MatriculaDialogResult {
    salvar: boolean;
    matricula: Partial<Matricula> | undefined;
}

export const FETCH_ALL = gql`  
  query fetchAllMatriculas($idTurma: ID!, $page: Int, $size: Int, $sort: [SortRequest]) { 
    fetchAllMatriculas(idTurma: $idTurma, page: $page, size: $size, sort: $sort) {    
      number
      size
      totalElements
      totalPages
      first
      last
      empty
      content {
        id
        codigo
        turma {
          id
          nome
        }
        cliente {
          id
          nome
        }
        clienteDependente {
          id
          nome
        }
        status
        observacoes
        dataCadastro
      }
    }
  }
`;

export const SAVE = gql`
  mutation saveMatricula($request: MatriculaRequest!){  
    saveMatricula(request:$request)
  }
`;

export const DELETE_BY_ID = gql`
  mutation deleteMatriculaById($id: ID!){  
    deleteMatriculaById(id:$id)
  }
`;

export const FETCH_BY_ID = gql`
  query fetchByIdMatricula($id: ID!) { # $id: ID! means the id is a required ID type
    fetchByIdMatricula(id: $id) {
        id
        codigo
        turma {
          id
          nome
        }
        cliente {
          id
          nome
        }
        clienteDependente {
          id
          nome
        }
        status
        observacoes
    }
  }
`;