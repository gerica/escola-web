import { gql } from "apollo-angular";
import { TipoSexo } from "./tipo-sexo.enum";
import { TipoParentesco } from "./tipo-parentesco.enum";

export default interface ClienteDependente {
  id: number,
  idCliente: number,
  nome: string,
  sexo: TipoSexo,
  docCPF: string,
  dataNascimento: Date,
  parentescoDescricao: TipoParentesco
  parentesco: string,
}

const SAVE_CLIENTE_DEPENDENTE = gql`
  mutation saveClienteDependente($request: ClienteDependenteRequest!){  
    saveClienteDependente(request:$request){
      id
      nome
      sexo
      docCPF
    }
  }
`;

const DELETE_DEPENDENTE_BY_ID = gql`
  mutation deleteDependenteById($id: ID!){  
    deleteDependenteById(id: $id)
  }
`;

const FETCH_ALL_DEPENDENTES_BY_CLIENTE = gql`  
  query fetchDependenteByIdCliente($id: ID!) { 
    fetchDependenteByIdCliente(id: $id){    
      id
      nome
      sexo
      docCPF
      parentesco
      parentescoDescricao
      dataNascimento
    }
  }
`;

const FETCH_DEPENDENTE_BY_ID = gql`
  query fetchDependenteById($id: ID!) { 
    fetchDependenteById(id: $id) {
      id
      nome
      sexo
      docCPF
      parentesco
      parentescoDescricao
      dataNascimento
    }
  }
`;


export {
  DELETE_DEPENDENTE_BY_ID, FETCH_ALL_DEPENDENTES_BY_CLIENTE,
  FETCH_DEPENDENTE_BY_ID, SAVE_CLIENTE_DEPENDENTE
};
