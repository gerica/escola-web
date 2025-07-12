export interface Estado {
    sigla: string;
    descricao: string;
}

export function obterNomePorSigla(sigla: string): string {

    switch (sigla) {
        case 'AC':
            return 'Acre';
        case 'AL':
            return 'Alagoas';
        case 'AP':
            return 'Amapá';
        case 'AM':
            return 'Amazonas';
        case 'BA':
            return 'Bahia';
        case 'CE':
            return 'Ceará';
        case 'DF':
            return 'Distrito Federal';
        case 'ES':
            return 'Espírito Santo';
        case 'GO':
            return 'Goiás';
        case 'MA':
            return 'Maranhão';
        case 'MG':
            return 'Minas Gerais';
        case 'MT':
            return 'Mato Grosso';
        case 'MS':
            return 'Mato Grosso do Sul';
        case 'PA':
            return 'Pará';
        case 'PB':
            return 'Paraíba';
        case 'PR':
            return 'Paraná';
        case 'PE':
            return 'Pernambuco';
        case 'PI':
            return 'Piauí';
        case 'RJ':
            return 'Rio de Janeiro';
        case 'RN':
            return 'Rio Grande do Norte';
        case 'RS':
            return 'Rio Grande do Sul';
        case 'RO':
            return 'Rondônia';
        case 'RR':
            return 'Roraima';
        case 'SC':
            return 'Santa Catarina';
        case 'SP':
            return 'São Paulo';
        case 'SE':
            return 'Sergipe';
        case 'TO':
            return 'Tocantins';

        default:
            break;
    }
    return "não encontrado"
}
