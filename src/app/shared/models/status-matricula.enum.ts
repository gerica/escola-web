export enum StatusMatricula {
    ATIVA = "ATIVA",
    ABERTA = "ABERTA",    
    INATIVA = "INATIVA",
    CONCLUIDA = "CONCLUIDA",
    TRANCADA = "TRANCADA",
    CANCELADA = "CANCELADA"
}

export const StatusMatriculaLabelMapping: Record<StatusMatricula, string> = {
    [StatusMatricula.ATIVA]: 'Ativa',
    [StatusMatricula.ABERTA]: 'Aberta',
    [StatusMatricula.INATIVA]: 'Inativa',
    [StatusMatricula.CONCLUIDA]: 'Concluída',
    [StatusMatricula.TRANCADA]: 'Trancada',
    [StatusMatricula.CANCELADA]: 'Cancelada',
};
