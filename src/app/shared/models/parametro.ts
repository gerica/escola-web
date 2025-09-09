import { gql } from "apollo-angular";

export interface Parametro {
  id: number;
  chave: string;  
  valor: string;
}

export const CHAVE_CONTRATO_CIDADE_PADRAO = "CHAVE_CONTRATO_CIDADE_PADRAO";
export const CHAVE_CONTRATO_MODELO_PADRAO = "CHAVE_CONTRATO_MODELO_PADRAO";
export const CHAVE_MENSAGEM_WHATSAPP = "CHAVE_MENSAGEM_WHATSAPP";

export const FIND_BY_CHAVE = gql`
  query FindByChave($chave: String!){
    findByChave(chave: $chave){  
      id
      chave
      valor
    }
  }
`;

export const SALVAR_PARAMETRO = gql`
  mutation SalvarParametro($request: ParametroRequest!){
    salvarParametro(request:$request){
      chave
      valor
    }
  }
`;
