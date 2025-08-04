import { gql } from "apollo-angular";

// -------------------------------------------------------------------------
export interface Anexo {
    id: number,
    nomeArquivo: string,
    conteudoBase64: string,
    dataCadastro: Date,
}

export interface AnexoBase64 {
    nomeArquivo: string,
    conteudoBase64: string,
}


// -------------------------------------------------------------------------
// Queries e Mutações GraphQL
// -------------------------------------------------------------------------
export const FETCH_ANEXOS = gql`
  query FetchAnexos($idContrato: ID!) {
    anexosDoContrato(idContrato: $idContrato) {
      id
      nomeArquivo      
    }
  }
`;

export const UPLOAD_ANEXO = gql`
  mutation UploadAnexo($request: AnexoRequest!) {
    uploadAnexo(request:$request) {
      id
      nomeArquivo
      dataCadastro
    }
  }
`;

export const DELETE_ANEXO = gql`
  mutation DeleteAnexoById($id: ID!) {
    deleteAnexoById(id: $id)
  }
`;

export const DOWNLOAD_ANEXO = gql`
  query DownloadAnexos($id: ID!) {
    downloadAnexo(id: $id){
        nomeArquivo
        conteudoBase64
    }
  }
`;
