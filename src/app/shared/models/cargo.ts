import { gql } from "apollo-angular";
import { Empresa } from "./empresa";

export interface Cargo {
    id: number,
    nome: String,
    descricao: String,
    ativo: boolean,
    empresa: Empresa,
    dataCadastro: Date,
    dataAtualizacao: Date, // Data e hora da última atualização do registro
}

export const FETCH_ALL_CARGOS = gql`  
  query fetchAllCargos($filtro: String, $page: Int, $size: Int, $sort: [SortRequest]) { 
    fetchAllCargos(filtro: $filtro, page: $page, size: $size, sort: $sort) {    
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
       
        dataCadastro
        dataAtualizacao      
      }
    }
  }
`;

export const SAVE_CARGO = gql`
  mutation saveCargo($request: CargoRequest!){  
    saveCargo(request:$request){
        id    
        nome
        descricao
        ativo
    }
  }
`;