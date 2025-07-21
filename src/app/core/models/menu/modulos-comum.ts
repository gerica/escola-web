import { MenuItem } from "./menu-item";
import { modulosAdminEmpresa } from "./modulos-admin-empresa";
import { modulosSuperadmin } from "./modulos-superadmin";

export const moduloInicial = 'inicio';

export const modulos: MenuItem[] = [
  {
    icon: 'house',
    name: 'Início',
    router: moduloInicial,
    parent: null,
    submenus: null,
  },
  ...modulosAdminEmpresa,
  ...modulosSuperadmin,

];


// Gestão de Empresas:
// Gestão de Usuários Globais:
// Configurações do Sistema:
// Relatórios e Análises:
