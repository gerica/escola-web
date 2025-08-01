import { gql } from "apollo-angular";
import { Empresa } from "./empresa";
import { DiasSemana } from "./dias-semana.enum";
import { Curso } from "./curso";
import { StatusTurma } from "./status-turma.enum";

export interface Turma {
  id: number,
  curso: Curso,
  empresa: Empresa,
  nome: String,
  codigo: String,
  capacidadeMaxima: number
  status: StatusTurma,
  anoPeriodo: String,
  horarioInicio: Date,
  horarioFim: Date,
  diasDaSemana: DiasSemana[]
  professor: String,
  dataInicio: Date,
  dataFim: Date, // Data e hora da última atualização do registro
  dataCadastro: Date,
  dataAtualizacao: Date, // Data e hora da última atualização do registro
}

export const FETCH_ALL_TURMAS = gql`  
  query fetchAllTurmas($filtro: String, $page: Int, $size: Int, $sort: [SortRequest]) { 
    fetchAllTurmas(filtro: $filtro, page: $page, size: $size, sort: $sort) {    
      number
      size
      totalElements
      totalPages
      first
      last
      empty
      content {
        id
        curso {
          id
          nome          
        }        
        nome
        codigo
        capacidadeMaxima
        status
        anoPeriodo
        horarioInicio
        horarioFim
        diasDaSemana
        professor
      }
    }
  }
`;

export const SAVE_TURMA = gql`
  mutation saveTurma($request: TurmaRequest!){  
    saveTurma(request:$request){
        id
        nome
        codigo
        capacidadeMaxima
        status
        anoPeriodo
        horarioInicio
        horarioFim
        diasDaSemana
        professor
    }
  }
`;

export const DELETE_TURMA_BY_ID = gql`
  mutation deleteTurmaById($id: ID!){  
    deleteTurmaById(id:$id)
  }
`;

export const FETCH_BY_ID = gql`
  query fetchByIdTurma($id: ID!) { # $id: ID! means the id is a required ID type
    fetchByIdTurma(id: $id) {
      id
      curso {
        id
        nome
      }      
      nome
      codigo
      capacidadeMaxima
      status
      anoPeriodo
      horarioInicio
      horarioFim
      diasDaSemana
      professor
      dataInicio
      dataFim
    }
  }
`;