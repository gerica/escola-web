import { gql } from "apollo-angular";

export const GET_MUNICIPIOS = gql`
  query getMunicipios{
    getMunicipios{
        codigo
        descricao
        estado {
          sigla
          descricao
        }
        uf
    }
  }
`;

export const FETCH_CIDADE_BY_FILTRO = gql`  
  query fetchByFiltro($filtro: String, $page: Int, $size: Int, $sort: [SortRequest]) { 
    fetchByFiltro(filtro: $filtro, page: $page, size: $size, sort: $sort) {    
      number
      size
      totalElements
      totalPages
      first
      last
      empty
      content {
        codigo
        descricao
        uf
        estado
      }
    }
  }
`;

export const FETCH_CIDADE_BY_CODIGO = gql`  
  query fetchMunicipioCodigo($codigo: String) { 
    fetchMunicipioCodigo(codigo: $codigo) {    
      codigo
      descricao
      uf
      estado
    }
  }
`;