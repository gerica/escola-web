export enum DiasSemana {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY',
}

export const DiasSemanaLabelMapping: Record<DiasSemana, string> = {
    [DiasSemana.MONDAY]: 'Segunda-feira',
    [DiasSemana.TUESDAY]: 'Terça-feira',
    [DiasSemana.WEDNESDAY]: 'Quarta-feira',
    [DiasSemana.THURSDAY]: 'Quinta-feira',
    [DiasSemana.FRIDAY]: 'Sexta-feira',
    [DiasSemana.SATURDAY]: 'Sábado',
    [DiasSemana.SUNDAY]: 'Domingo',

};
