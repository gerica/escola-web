import { gql } from "apollo-angular";
import { Empresa } from "./empresa";

export interface Curso {
    id: number,
    empresa: Empresa,
    nome: String,
    descricao: String,
    duracao: String,
    categoria: String,
    valorMensalidade: number,
    ativo: boolean,
    dataCadastro: Date,
    dataAtualizacao: Date, // Data e hora da última atualização do registro
}

export const FETCH_ALL_CURSOS = gql`  
  query fetchAllCursos($filtro: String, $page: Int, $size: Int, $sort: [SortRequest]) { 
    fetchAllCursos(filtro: $filtro, page: $page, size: $size, sort: $sort) {    
      number
      size
      totalElements
      totalPages
      first
      last
      empty
      content {
        id
        nome
        descricao
        ativo    
        duracao
        categoria
        valorMensalidade
      }
    }
  }
`;

export const SAVE_CURSO = gql`
  mutation saveCurso($request: CursoRequest!){  
    saveCurso(request:$request){
        id
        nome
        descricao
        ativo    
        duracao
        categoria
        valorMensalidade
    }
  }
`;