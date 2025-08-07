import { gql } from "apollo-angular";
import { StatusContaReceber } from "./status-conta-receber.enum";

export interface ContaReceber {
  id: number,
  valorTotal: number,
  desconto: number,
  status: StatusContaReceber,
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
  query FetchAllContasReceber($idContrato: ID!) { 
    fetchAllContasReceber(idContrato:$idContrato) {      
      id      
      valorTotal
      desconto
      status
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
        valorTotal
        desconto
        status
        valorPago
        dataVencimento
        dataPagamento
        observacoes
    }
  }
`;

export const DELETE_CONTA_RECEBER_BY_ID = gql`
  mutation ApagarContaReceber($id: ID!){  
    apagarContaReceber(id: $id)
  }
`;