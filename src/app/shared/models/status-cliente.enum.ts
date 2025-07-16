export enum StatusCliente {
    ATIVO = 'ATIVO',
    INATIVO = 'INATIVO',
    BLOQUEADO = 'BLOQUEADO',
    PENDENTE_APROVACAO = 'PENDENTE_APROVACAO'
}

export const StatusClienteLabelMapping: Record<StatusCliente, string> = {
    [StatusCliente.ATIVO]: 'Ativo',
    [StatusCliente.INATIVO]: 'Inativo',
    [StatusCliente.BLOQUEADO]: 'Bloqueado',
    [StatusCliente.PENDENTE_APROVACAO]: 'Pendente Aprovação',
};
