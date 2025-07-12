import { gql } from "apollo-angular";

export default interface Contrato {
    nome: string,
    dataNascimento: Date,
    estado: string,
    cidade: string,
    docCPF: string,
    docRG: string,
    telResidencial: string,
    telCelular: string,
    endereco: string,
    email: string,
    profissao: string,
    localTrabalho: string,
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