import { inject, Injectable, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import { KEY_LOCAL_STORE_CIDADES, KEY_LOCAL_STORE_ESTADOS } from '../common/constants';
import { Cidade, defaultCidade } from '../models/cidade';
import { Estado, obterNomePorSigla } from '../models/estado';
import { GET_MUNICIPIOS } from '../models/utils';


@Injectable({ providedIn: 'root' })
export class UtilsService {
    private apollo = inject(Apollo);

    cidades = signal<Cidade[]>([]);
    estados = signal<Estado[]>([]);

    recuperarEstados(): Observable<Estado[]> {
        return new Observable<Estado[]>(observer => {
            const strEstados = localStorage.getItem(KEY_LOCAL_STORE_ESTADOS);
            let storage;
            if (strEstados !== null && strEstados !== "undefined") {
                storage = JSON.parse(strEstados);
            }
            if (storage) {
                observer.next(storage);
                observer.complete();
            }

            this.recuperarMunicipiosObservable().subscribe({
                next: (data) => { this.montarListaEstados(data); },     // nextHandler
                error: (error) => observer.error(error.message === undefined ? error : error.message),    // errorHandler 
                complete: () => {
                    this.gravarLocalStorage();
                    observer.next(this.estados());
                    observer.complete();
                }, // completeHandler
            });

        });
    }

    recuperarMunicipiosPorEstado(estado: Estado): Observable<Cidade[]> {
        return new Observable<Cidade[]>(observer => {
            const strCidades = localStorage.getItem(KEY_LOCAL_STORE_CIDADES);
            let storage;
            if (strCidades !== null && strCidades !== "undefined") {
                storage = JSON.parse(strCidades);
            }
            if (storage) {
                this.cidades.set(storage);
                observer.next(this.montarListaCidadesPorEstado(estado));
                observer.complete();
            }

            this.recuperarMunicipiosObservable().subscribe({
                next: (data) => { this.montarListaEstados(data); },     // nextHandler
                error: (error) => observer.error(error.message === undefined ? error : error.message),    // errorHandler 
                complete: () => {
                    this.gravarLocalStorage();
                    return signal(this.montarListaCidadesPorEstado(estado));
                }, // completeHandler
            });
        });
    }


    recuperarMunicipioPorId(codigo: any): Observable<Cidade> {

        return new Observable<Cidade>(observer => {

            const cidades = localStorage.getItem(KEY_LOCAL_STORE_CIDADES);
            let storage;
            if (cidades) {
                storage = JSON.parse(cidades);
            }
            if (storage) {
                for (let e of storage) {
                    if (e.codigo === `${codigo}`) {
                        observer.next(e);
                        observer.complete();
                    }
                }
                observer.next(defaultCidade);
                observer.complete();
            } else {
                this.recuperarMunicipiosObservable().subscribe(
                    {
                        next: (data) => {
                            this.montarListaEstados(data);
                        },
                        error: (error) => {
                            observer.error(error.message === undefined ? error : error.message);
                        },
                        complete: () => {
                            this.gravarLocalStorage();
                            for (let e of this.cidades()) {
                                if (`${e.codigo}` === `${codigo}`) {
                                    observer.next(e);
                                    observer.complete();
                                }
                            }
                        }
                    }
                );
            }
        });
    }

    recuperarMunicipiosObservable(): Observable<Cidade[]> {
        return this.apollo.query<{ getMunicipios: Cidade[] }>({
            query: GET_MUNICIPIOS,
            context: {
                uri: '/clients/graphql'
            }
        }).pipe(
            map(result => result.data.getMunicipios),
            // tap(result=>{
            //     console.log(result);
            // })                        
        );
    }

    private gravarLocalStorage(): void {
        localStorage.setItem(KEY_LOCAL_STORE_ESTADOS, JSON.stringify(this.estados()));
        localStorage.setItem(KEY_LOCAL_STORE_CIDADES, JSON.stringify(this.cidades()));
    }

    private montarListaEstados(data: any): void {
        if (!data) {
            return;
        }

        const findEstadoBySigla = (uf: string) => {
            return this.estados().findIndex(e => {
                if (!e) {
                    return false;
                }
                return e.sigla === uf;
            });
        };

        const criarEstados = (estadoDado: Estado) => {
            const index = findEstadoBySigla(estadoDado.sigla);
            if (index < 0) {
                this.estados.update(vals => ([
                    ...vals,
                    {
                        sigla: estadoDado.sigla,
                        descricao: obterNomePorSigla(estadoDado.sigla)
                    }
                ]));
            }
        };

        const criarCidades = (cidadeDado: any, estadoDado: Estado) => {
            this.cidades.update(vals => (
                [
                    ...vals,
                    {
                        codigo: cidadeDado.codigo,
                        descricao: cidadeDado.descricao,
                        uf: estadoDado.sigla
                    }
                ]
            ));
        };

        data.forEach((e: any) => {
            criarEstados(e.estado);
        });

        // Create a lookup map to optimize searches
        const estadosMap = new Map(this.estados().map(estado => [estado.sigla, estado]));

        data.forEach((e: any) => {
            const estadoTemp = estadosMap.get(e.estado.sigla);
            if (estadoTemp) {
                criarCidades(e, estadoTemp);
            }
        });

        this.estados().sort((a, b) => a.descricao.localeCompare(b.descricao));

    }

    private montarListaCidadesPorEstado(estado: Estado): Cidade[] {
        const result: Cidade[] = [];
        this.cidades().forEach(c => {
            if (c.uf === estado.sigla) {
                result.push(c);
            }
        });
        return result;
    }

}
