export enum TipoSexo {
    HOMEM = 'HOMEM',
    MULHER = 'MULHER'
}

export const TipoSexoLabelMapping: Record<TipoSexo, string> = {
    [TipoSexo.HOMEM]: 'Homem',
    [TipoSexo.MULHER]: 'Mulher',
};