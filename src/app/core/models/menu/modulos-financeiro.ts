import { MenuItem } from "./menu-item";

export const moduloConta = 'conta';
export const moduloContaReceber = `${moduloConta}/receber`;
export const moduloContaPagar = `${moduloConta}/pagar`;


export const modulosFinanceiro: MenuItem[] = [
  {
    icon: 'contract',
    name: 'Contas',
    router: moduloConta,
    parent: null,
    submenus: null,
    order: 1,
  },
  {
    icon: 'contract',
    name: 'Receber',
    router: moduloContaReceber,
    parent: moduloConta,
    submenus: null,
    order: 2,
  },
  {
    icon: 'contract',
    name: ' Pagar',
    router: moduloContaPagar,
    parent: moduloConta,
    submenus: null,
    order: 3,
  }
];


// Gestão de Empresas:
// Gestão de Usuários Globais:
// Configurações do Sistema:
// Relatórios e Análises:
