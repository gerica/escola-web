import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Page, PageRequest } from 'src/app/core/models';
import { Cidade } from '../models/cidade';
import { FETCH_CIDADE_BY_CODIGO, FETCH_CIDADE_BY_FILTRO } from '../models/utils';
import ArquivoBase64 from '../models/arquivo.base64';

const URL = '/utils/graphql';

@Injectable({ providedIn: 'root' })
export class UtilsService {
    private apollo = inject(Apollo);

    recuperarPorFiltro(filtro: string, pageRequest: PageRequest): Observable<Page<Cidade>> {
        return this.apollo.query<any>({
            query: FETCH_CIDADE_BY_FILTRO,
            variables: {
                filtro: filtro,
                page: pageRequest.page,
                size: pageRequest.size,
                sort: pageRequest.sorts || [],
            },
            context: {
                uri: URL
            },
            fetchPolicy: 'cache-first',
        }).pipe(
            map(result => result.data.fetchByFiltro as Page<Cidade>),
            // tap(value => {
            //   console.log("Received GraphQL data:", value);
            // }),
        );
    }

    recuperarPorCodigo(codigo: String): Observable<Cidade> {
        return this.apollo.query<any>({
            query: FETCH_CIDADE_BY_CODIGO,
            variables: { codigo: codigo },
            context: { uri: URL },
            fetchPolicy: 'cache-first',
        }).pipe(
            map(result => result.data.fetchMunicipioCodigo as Cidade),
            // tap(value => {
            //   console.log("Received GraphQL data:", value);
            // }),
        );
    }

    getMimeType(fileName: string): string {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return 'application/pdf';
            case 'doc':
            case 'docx':
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            default:
                return 'application/octet-stream';
        }
    }

    downloadFile(documento: ArquivoBase64) {
        // O tipo do arquivo (MIME type) é necessário para o Blob.
        // Você pode inferir isso do nome do arquivo ou passar do backend.
        const mimeType = this.getMimeType(documento.nomeArquivo);
        // const mimeType = "application/pdf";

        // Decodifica a string Base64 e cria um Blob
        const byteCharacters = atob(documento.conteudoBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });

        // Cria um link e simula o clique para iniciar o download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = documento.nomeArquivo;
        link.click();

        window.URL.revokeObjectURL(link.href); // Libera o objeto URL
    }

}
