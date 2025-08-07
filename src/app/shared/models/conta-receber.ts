import { gql } from "apollo-angular";
import Contrato from "./contrato";

export interface ContaReceber {
  id: number,
  contrato: Contrato,
  valorTotal: number,
  desconto: number,
  valorPago: number,
  dataVencimento: Date
  dataPagamento: Date
  observacoes: String
}

export const CRIAR_CONTA_RECEBER = gql`
  mutation CriarContasReceber($idContrato: ID!){  
    criarContasReceber(idContrato:$idContrato)
  }
`;


export const FETCH_ALL_CONTAS_RECEBER_BY_CONTRATO = gql`  
  query FetchAllContasReceber($idContrato:ID!) { 
    fetchAllContasReceber(idContrato:$idContrato) {      
      id
      contrato {
        id
        numeroContrato
      }
      valorTotal
      desconto
      valorPago
      dataVencimento
      dataPagamento
      observacoes      
    }
  }
`;

export const FETCH_CONTA_RECEBER_BY_ID = gql`
  query FetchByIdContaReceber($id: ID!) { # $id: ID! means the id is a required ID type
    fetchByIdContaReceber(id: $id) {
        id
        contrato {
          id
        }
        valorTotal
        desconto
        valorPago
        dataVencimento
        dataPagamento
        observacoes
    }
  }
`;

export const DELETE_CANTA_RECEBER_BY_ID = gql`
  mutation ApagarContaReceber($id: ID!){  
    apagarContaReceber(id:$id)
  }
`;