export enum StatusTurma {
    ATIVO = 'ATIVO',
    INATIVO = 'INATIVO',
    LOTADA = 'LOTADA',
    EM_FORMACAO = 'EM_FORMACAO',
    CANCELADA = 'CANCELADA',
}

export const StatusTurmaLabelMapping: Record<StatusTurma, string> = {
    [StatusTurma.ATIVO]: 'Ativo',
    [StatusTurma.INATIVO]: 'Inativo',
    [StatusTurma.LOTADA]: 'Lotada',
    [StatusTurma.EM_FORMACAO]: 'Em Formação',
    [StatusTurma.CANCELADA]: 'Cancelada',
};
