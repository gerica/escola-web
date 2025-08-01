import { gql } from "apollo-angular";
import { StatusContrato } from "./status-contrato.enum";
import { PeriodoPagamento } from "./periodos-pagamento.enum";
import Cliente from "./cliente";

export default interface Contrato {
  id: number,
  idCliente: number,
  cliente: Cliente,
  nomeCliente: string,
  numeroContrato: number,
  dataInicio: Date,
  dataFim: Date,
  valorTotal: number,
  desconto: number,
  statusContrato: StatusContrato,
  descricao: string,
  termosCondicoes: string,
  dataAssinatura: Date,
  periodoPagamento: PeriodoPagamento,
  dataProximoPagamento: Date,
  observacoes: string,
  contratoDoc: string,

}

export const SAVE_CONTRATO = gql`
  mutation saveContrato($request: ContratoRequest!){  
    saveContrato(request:$request)
  }
`;

export const FETCH_ALL_CONTRATOS = gql`  
  query fetchAllContratos($filtro: String, $page: Int, $size: Int, $sort: [SortRequest]) { 
    fetchAllContratos(filtro: $filtro, page: $page, size: $size, sort: $sort) {    
      number
      size
      totalElements
      totalPages
      first
      last
      empty
      content {
        id
        idCliente
        numeroContrato
        nomeCliente
        dataInicio
        dataFim
        valorTotal
        statusContrato
        descricao
        termosCondicoes
        dataAssinatura
        periodoPagamento
        dataProximoPagamento
        observacoes
      }
    }
  }
`;

export const FETCH_CONTRATO_BY_ID = gql`
  query fetchById($id: ID!) { # $id: ID! means the id is a required ID type
    fetchById(id: $id) {
        id
        idCliente
        nomeCliente
        numeroContrato
        dataInicio
        dataFim
        valorTotal
        statusContrato
        descricao
        termosCondicoes
        dataAssinatura
        periodoPagamento
        dataProximoPagamento
        observacoes
        contratoDoc
    }
  }
`;

export const FETCH_CONTRATO_BY_ID_MATRICULA = gql`
  query fetchContratoByIdMatricula($id: ID!) { # $id: ID! means the id is a required ID type
    fetchContratoByIdMatricula(id: $id) {
        id
        idCliente
        nomeCliente
        numeroContrato
        dataInicio
        dataFim
        valorTotal
        desconto
        statusContrato
        descricao
        termosCondicoes
        dataAssinatura
        periodoPagamento
        dataProximoPagamento
        observacoes
        contratoDoc
    }
  }
`;

export const CARREGAR_CONTRATO = gql`
  mutation parseContrato($id: ID!){  
    parseContrato(id:$id){
        contratoDoc
    }
  }
`;