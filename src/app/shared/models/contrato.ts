import { gql } from "apollo-angular";
import Cliente from "./cliente";
import { Cidade } from "./cidade";
import { Estado } from "./estado";

export default interface Contrato {
  id: number,
  cliente: Cliente,
  dataContrato: Date,
  estado: Estado,
  cidade: Cidade,
}


const GET_OUTRO_CONTRATO = gql`
  query getOutroContrato{
    getOutroContrato
  }
`;

const SAVE_CONTRATO = gql`
  mutation authenticate($username: String!, $password: String!) {
    authenticate(request: {username: $username, password: $password}) {
        token
        username
        firstName
        lastName
        roles
    }
  }
`;

export {
  GET_OUTRO_CONTRATO,
  SAVE_CONTRATO
};