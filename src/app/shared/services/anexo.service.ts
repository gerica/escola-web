import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { URL_ADMIN } from '../common/constants';
import { Anexo, DELETE_ANEXO, DOWNLOAD_ANEXO, FETCH_ANEXOS, UPLOAD_ANEXO } from '../models/anexo';
import ArquivoBase64 from '../models/arquivo.base64';


@Injectable({ providedIn: 'root' })
export class AnexoService {
    private apollo = inject(Apollo);
    getAnexos(idContrato: number): Observable<Anexo[]> {
        return this.apollo.query<{ anexosDoContrato: Anexo[] }>({
            query: FETCH_ANEXOS,
            variables: { idContrato },
            context: { uri: URL_ADMIN },
            fetchPolicy: 'network-only' // Para sempre buscar a lista mais recente
        }).pipe(
            map(result => result.data.anexosDoContrato),
            // tap(value => {
            //     console.log("Received GraphQL data:", value);
            // }),
        );
    }

    // Método de upload atualizado para receber a string Base64
    uploadAnexo(conteudoBase64: string, nomeArquivo: string, idContrato: number): Observable<Anexo> {        
        return this.apollo.mutate<{ uploadAnexo: Anexo }>({
            mutation: UPLOAD_ANEXO,
            variables: {
                request: {
                    idContrato,
                    nomeArquivo,
                    conteudoBase64,
                }
            },
            context: { uri: URL_ADMIN },
            fetchPolicy: 'network-only' // Para sempre buscar a lista mais recente
        }).pipe(
            map(result => result.data!.uploadAnexo),
            // tap(value => {
            //     console.log("Received GraphQL data:", value);
            // }),
        );
    }

    deleteAnexo(idAnexo: number): Observable<boolean> {
        return this.apollo.mutate<any>({
            mutation: DELETE_ANEXO,
            variables: { id: idAnexo },
            context: { uri: URL_ADMIN }
        }).pipe(
            map(result => result.data.deleteAnexoById),
            // tap(value => {
            //     console.log("Received GraphQL data:", value);
            // }),
        );
    }

    downloadAnexo(idAnexo: number): Observable<ArquivoBase64> {
        console.log(`Baixar anexo #${idAnexo} via GraphQL`);
        return this.apollo.query<any>({
            query: DOWNLOAD_ANEXO,
            variables: { id: idAnexo },
            context: { uri: URL_ADMIN }
        }).pipe(
            map(result => result.data.downloadAnexo),
        );
    }
}
