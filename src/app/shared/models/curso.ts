import { gql } from "apollo-angular";
import { Empresa } from "./empresa";

export interface Curso {
  id: number,
  empresa: Empresa,
  nome: string,
  descricao: string,
  duracaoValor: number,
  duracaoUnidade: string,
  categoria: string,
  valorMensalidade: number,
  ativo: boolean,
  dataCadastro: Date,
  dataAtualizacao: Date, // Data e hora da última atualização do registro
}

export const DuracaoUnidadeLabelMapping: Record<string, string> = {
  DIAS: 'Dias',
  SEMANAS: 'Semanas',
  MESES: 'Meses',
  ANOS: 'Anos',
};

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
        duracaoValor
        duracaoUnidade
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
        duracaoValor
        duracaoUnidade
        categoria
        valorMensalidade
    }
  }
`;

export const DELETE_CURSO_BY_ID = gql`
  mutation deleteCursoById($id: ID!){  
    deleteCursoById(id:$id)
  }
`;