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
