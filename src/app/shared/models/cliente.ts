import { gql } from "apollo-angular";
import { Cidade } from "./cidade";
import { StatusCliente } from "./status-cliente.enum";

export default interface Cliente {
  id: number,
  nome: string,
  dataNascimento: Date,
  cidade: Cidade;
  cidadeDesc: string,
  uf: string,
  codigoCidade: string,
  docCPF: string,
  docRG: string,
  endereco: string,
  email: string,
  profissao: string,
  localTrabalho: string,
  statusCliente: StatusCliente
}


const SAVE_CLIENTE = gql`
  mutation saveCliente($request: ClienteRequest!){  
    saveCliente(request:$request){
      id
      nome
      dataNascimento
      docCPF
      email
      docRG
      cidadeDesc 
      uf
      codigoCidade
      endereco
      profissao
      localTrabalho
      statusCliente
    }
  }
`;

const FETCH_ALL_CLIENTES = gql`  
  query fetchAllClientes($filtro: String, $page: Int, $size: Int, $sort: [SortRequest]) { 
    fetchAllClientes(filtro: $filtro, page: $page, size: $size, sort: $sort) {    
      number
      size
      totalElements
      totalPages
      first
      last
      empty
      content {
        cidadeDesc 
        uf
        codigoCidade
        dataNascimento
        docCPF
        docRG
        email
        endereco
        id
        localTrabalho
        nome
        profissao
        statusCliente
      }
    }
  }
`;

const FETCH_ALL_ATIVOS_CLIENTES = gql`  
  query fetchAllClientesAtivos($filtro: String, $page: Int, $size: Int, $sort: [SortRequest]) { 
    fetchAllClientesAtivos(filtro: $filtro, page: $page, size: $size, sort: $sort) {    
      number
      size
      totalElements
      totalPages
      first
      last
      empty
      content {
        cidadeDesc 
        uf
        codigoCidade
        dataNascimento
        docCPF
        docRG
        email
        endereco
        id
        localTrabalho
        nome
        profissao
        statusCliente
      }
    }
  }
`;

const FETCH_CLIENTE_BY_ID = gql`
  query fetchByIdCliente($id: ID!) { # $id: ID! means the id is a required ID type
    fetchByIdCliente(id: $id) {
      id
      nome
      dataNascimento
      cidadeDesc 
      uf
      codigoCidade
      docCPF
      docRG
      endereco
      email
      profissao
      localTrabalho
      statusCliente
    }
  }
`;


export {
  SAVE_CLIENTE,
  FETCH_ALL_CLIENTES,
  FETCH_CLIENTE_BY_ID,
  FETCH_ALL_ATIVOS_CLIENTES
};