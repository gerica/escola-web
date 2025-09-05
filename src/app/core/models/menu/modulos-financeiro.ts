import { MenuItem } from "./menu-item";

export const moduloConta = 'conta';
export const moduloContaReceber = `${moduloConta}/receber`;
export const moduloContaPagar = `${moduloConta}/pagar`;
export const moduloPainel = 'painel';
export const moduloPainelResumoFinanceiro = `${moduloPainel}/financeiro`;


export const modulosFinanceiro: MenuItem[] = [
  {
    icon: 'contract',
    name: 'Contas',
    router: moduloConta,
    parent: null,
    submenus: null,    
  },
  {
    icon: 'contract',
    name: 'Receber',
    router: moduloContaReceber,
    parent: moduloConta,
    submenus: null,    
  },
  {
    icon: 'contract',
    name: 'Pagar',
    router: moduloContaPagar,
    parent: moduloConta,
    submenus: null,    
  },
  {
    icon: 'contract',
    name: 'Painel',
    router: moduloPainel,
    parent: null,
    submenus: null,    
  },
  {
    icon: 'contract',
    name: 'Financeiro',
    router: moduloPainelResumoFinanceiro,
    parent: moduloPainel,
    submenus: null,    
  }
];


// Gestão de Empresas:
// Gestão de Usuários Globais:
// Configurações do Sistema:
// Relatórios e Análises:
