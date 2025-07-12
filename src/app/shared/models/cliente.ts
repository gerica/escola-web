import { gql } from "apollo-angular";
import { Cidade } from "./cidade";

export default interface Cliente {
  id: number,
  nome: string,
  dataNascimento: Date,
  cidade: Cidade,
  docCPF: string,
  docRG: string,
  endereco: string,
  email: string,
  profissao: string,
  localTrabalho: string,
  // telResidencial: string,
  // telCelular: string,
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
      cidade {
        codigo
        descricao
        uf
      }
      endereco
      profissao
      localTrabalho
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
        cidade {
          codigo
          descricao
          uf
        }
        dataNascimento
        docCPF
        docRG
        email
        endereco
        id
        localTrabalho
        nome
        profissao
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
      cidade {
        codigo
        descricao
        uf
      }
      docCPF
      docRG
      endereco
      email
      profissao
      localTrabalho
    }
  }
`;


export { SAVE_CLIENTE, FETCH_ALL_CLIENTES, FETCH_CLIENTE_BY_ID };