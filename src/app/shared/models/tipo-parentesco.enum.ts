export enum TipoParentesco {
    CONJUGE = 'CONJUGE',
    COMPANHEIRO = 'COMPANHEIRO',
    FILHO = 'FILHO',
    FILHA = 'FILHA',
    ENTEADO = 'ENTEADO',
    ENTEADA = 'ENTEADA',
    PAI = 'PAI',
    MAE = 'MAE',
    IRMAO = 'IRMAO',
    IRMA = 'IRMA',
    AVO = 'AVO',
    AVO_FEM = 'AVO_FEM',
    NETO = 'NETO',
    NETA = 'NETA',
    TUTORADO = 'TUTORADO',
    OUTRO = 'OUTRO'
}

export const TipoParentescoLabelMapping: Record<TipoParentesco, string> = {
    [TipoParentesco.CONJUGE]: 'Cônjuge',
    [TipoParentesco.COMPANHEIRO]: 'Companheiro(a)',
    [TipoParentesco.FILHO]: 'Filho',
    [TipoParentesco.FILHA]: 'Filha',
    [TipoParentesco.ENTEADO]: 'Enteado',
    [TipoParentesco.ENTEADA]: 'Enteada',
    [TipoParentesco.PAI]: 'Pai',
    [TipoParentesco.MAE]: 'Mãe',
    [TipoParentesco.IRMAO]: 'Irmão',
    [TipoParentesco.IRMA]: 'Irmã',
    [TipoParentesco.AVO]: 'Avô',
    [TipoParentesco.AVO_FEM]: 'Avó',
    [TipoParentesco.NETO]: 'Neto',
    [TipoParentesco.NETA]: 'Neta',
    [TipoParentesco.TUTORADO]: 'Tutorado(a)',
    [TipoParentesco.OUTRO]: 'Outro'
};