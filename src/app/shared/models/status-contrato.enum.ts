export enum StatusContrato {
    ATIVO = 'ATIVO',
    INATIVO = 'INATIVO',
    PENDENTE = 'PENDENTE',
    CANCELADO = 'CANCELADO',
    CONCLUIDO = 'CONCLUIDO',
    EM_NEGOCIACAO = 'EM_NEGOCIACAO'
}

export const StatusContratoLabelMapping: Record<StatusContrato, string> = {
    [StatusContrato.ATIVO]: 'Ativo',
    [StatusContrato.INATIVO]: 'Inativo',
    [StatusContrato.PENDENTE]: 'Pendente',
    [StatusContrato.CANCELADO]: 'Cancelado',
    [StatusContrato.CONCLUIDO]: 'Concluído',
    [StatusContrato.EM_NEGOCIACAO]: 'Negociação',
};