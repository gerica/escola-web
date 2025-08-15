import { gql } from "apollo-angular";

export interface Empresa {
  id?: number; // Opcional, pois pode não existir em novas empresas antes de salvar
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual?: string; // Opcional
  telefone?: string; // Opcional
  email: string;
  endereco: string;
  logoUrl?: string; // Opcional
  ativo: boolean;
  dataCadastro?: string; // Opcional, geralmente preenchido pelo backend
  dataAtualizacao?: string; // Opcional, geralmente preenchido pelo backend
}

const SAVE_EMPRESA = gql`
  mutation saveEmpresa($request: EmpresaRequest!){  
    saveEmpresa(request:$request){
        id
        nomeFantasia
        razaoSocial
        cnpj
        inscricaoEstadual
        telefone
        email
        endereco
        logoUrl
        ativo
        dataCadastro
        dataAtualizacao
    }
  }
`;

const FETCH_ALL_EMPRESAS = gql`  
  query fetchAllEmpresasByFilter($filtro: String, $page: Int, $size: Int, $sort: [SortRequest]) { 
    fetchAllEmpresasByFilter(filtro: $filtro, page: $page, size: $size, sort: $sort) {    
      number
      size
      totalElements
      totalPages
      first
      last
      empty
      content {
        id
        nomeFantasia
        razaoSocial
        cnpj
        inscricaoEstadual
        telefone
        email
        endereco
        logoUrl
        ativo
        dataCadastro
        dataAtualizacao
      }
    }
  }
`;

const FETCH_EMPRESA_BY_ID = gql`
  query fetchByIdEmpresa($id: ID!) { # $id: ID! means the id is a required ID type
    fetchByIdEmpresa(id: $id) {
        id
        nomeFantasia
        razaoSocial
        cnpj
        inscricaoEstadual
        telefone
        email
        endereco
        logoUrl
        ativo
        dataCadastro
        dataAtualizacao
    }
  }
`;

const DOWNLOAD_LISTA_EMPRESAS = gql`
  query DownloadListaEmpesas($request: FiltroRelatorioRequest!) {
    downloadListaEmpesas(request: $request){
        nomeArquivo
        conteudoBase64
    }
  }
`;


export { SAVE_EMPRESA, FETCH_ALL_EMPRESAS, FETCH_EMPRESA_BY_ID, DOWNLOAD_LISTA_EMPRESAS };