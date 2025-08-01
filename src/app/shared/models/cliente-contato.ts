import { gql } from "apollo-angular";
import { TipoContato } from "./tipo-contato.enum";

export default interface ClienteContato {
  id: number,
  idCliente: number,
  numero: string,
  tipoContato: TipoContato,
  observacao: string,
}

const SAVE_CLIENTE_CONTATO = gql`
  mutation saveClienteContato($request: ClienteContatoRequest!){  
    saveClienteContato(request:$request){
      id
      numero
      tipoContato
      observacao
    }
  }
`;

const DELETE_CONTATO_BY_ID = gql`
  mutation deleteContatoById($id: ID!){  
    deleteContatoById(id: $id)
  }
`;

const FETCH_ALL_CONTATOS_BY_CLIENTE = gql`  
  query fetchContatoByIdCliente($id: ID!) { 
    fetchContatoByIdCliente(id: $id){    
      id
      numero
      tipoContato
      observacao
    }
  }
`;

const FETCH_CONTATO_BY_ID = gql`
  query fetchContatoById($id: ID!) { 
    fetchContatoById(id: $id) {
      id
      numero
    }
  }
`;


export {
  DELETE_CONTATO_BY_ID, FETCH_ALL_CONTATOS_BY_CLIENTE,
  FETCH_CONTATO_BY_ID, SAVE_CLIENTE_CONTATO
};
