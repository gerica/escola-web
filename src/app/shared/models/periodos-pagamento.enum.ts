export enum PeriodoPagamento {
    MENSAL = 'Mensal',
    TRIMESTRAL = 'Trimestral',
    SEMESTRAL = 'Semestral',
    ANUAL = 'Anual',
}

export const PeriodoPagamentoLabelMapping: Record<PeriodoPagamento, string> = {
    [PeriodoPagamento.MENSAL]: 'Mensal',
    [PeriodoPagamento.TRIMESTRAL]: 'Trimestral',
    [PeriodoPagamento.SEMESTRAL]: 'Semestral',
    [PeriodoPagamento.ANUAL]: 'Anual',
};
