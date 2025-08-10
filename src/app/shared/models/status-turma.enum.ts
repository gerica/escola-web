export enum StatusTurma {
    ATIVA = 'ATIVA',
    INATIVA = 'INATIVA',
    LOTADA = 'LOTADA',
    EM_FORMACAO = 'EM_FORMACAO',
    CANCELADA = 'CANCELADA',
    CONCLUIDA = 'CONCLUIDA',
}

export const StatusTurmaLabelMapping: Record<StatusTurma, string> = {
    [StatusTurma.ATIVA]: 'Ativa',
    [StatusTurma.INATIVA]: 'Inativa',
    [StatusTurma.LOTADA]: 'Lotada',
    [StatusTurma.EM_FORMACAO]: 'Em Formação',
    [StatusTurma.CANCELADA]: 'Cancelada',
    [StatusTurma.CONCLUIDA]: 'Concluída',
};
