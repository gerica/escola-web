
export interface Cidade {
    codigo: string;
    descricao: string;
    uf: string;
}

export const defaultCidade: Cidade = {
    codigo: '',
    descricao: '',
    uf: '',
}
