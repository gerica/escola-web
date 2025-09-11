export enum StatusContaReceber {
    ABERTA = "ABERTA",
    PAGA = "PAGA",
    VENCIDA = "VENCIDA",
    CANCELADA = "CANCELADA"
}

export const StatusContaReceberLabelMapping: Record<StatusContaReceber, string> = {
    [StatusContaReceber.ABERTA]: 'Aberta',
    [StatusContaReceber.PAGA]: 'Paga',
    [StatusContaReceber.VENCIDA]: 'Vencida',
    [StatusContaReceber.CANCELADA]: 'Cancelada',
};
