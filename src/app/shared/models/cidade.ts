
export interface Cidade {
    codigo: string;
    descricao: string;
    uf: string;
    estado: string;
}

export const defaultCidade: Cidade = {
    codigo: '',
    descricao: '',
    uf: '',
    estado: ''
}
