import { gql } from "apollo-angular";
import { Cidade } from "./cidade";

export interface Parametro {
  id: number;
  chave: String;
  codigoMunicipio: String;
  modeloContrato: String;
  cidade: Cidade;
}

export const CHAVE_CONTRATO_CIDADE_PADRAO = "CHAVE_CONTRATO_CIDADE_PADRAO";
export const CHAVE_CONTRATO_MODELO_PADRAO = "CHAVE_CONTRATO_MODELO_PADRAO";

export const FIND_BY_CHAVE = gql`
  query findByChave($chave: String!){
    findByChave(chave: $chave){  
      id
      chave
      codigoMunicipio
      modeloContrato
    }
  }
`;

export const SALVAR_PARAMETRO = gql`
  mutation salvarParametro($request: ParametroRequest!){
    salvarParametro(request:$request){
      chave
      codigoMunicipio
      modeloContrato    
    }
  }
`;
