export enum StatusContaReceberContrato {
    NAO_CRIADO = "NAO_CRIADO",
    EM_DIA = "EM_DIA",
    EM_ATRASO = "EM_ATRASO"
}

export const StatusContaReceberLabelMapping: Record<StatusContaReceberContrato, string> = {
    [StatusContaReceberContrato.NAO_CRIADO]: 'Não Criado',
    [StatusContaReceberContrato.EM_DIA]: 'Em Dia',
    [StatusContaReceberContrato.EM_ATRASO]: 'Em Atraso',
};
