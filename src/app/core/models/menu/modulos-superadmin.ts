import { MenuItem } from "./menu-item";
export const moduloSuperadminEmpresa = 'empresa';
export const moduloUsuario = 'usuario';
export const moduloSuperadminSistema = 'superadmin/sistema';
export const moduloSuperadminRelatorio = 'superadmin/relatorio';
export const moduloSuperadminAssinaturas = 'superadmin/assinaturas';
export const moduloAminCamposFormularios = 'administrativo/campos-formularios';
export const moduloAdmin = 'administrativo';
export const moduloAdminPerfil = 'administrativo/perfis';

export const modulosSuperadmin: MenuItem[] = [

  {
    icon: 'contract',
    name: ' Empresas',
    router: moduloSuperadminEmpresa,
    parent: null,
    submenus: null,
  },
  {
    icon: 'contract',
    name: ' Usuários',
    router: moduloUsuario,
    parent: null,
    submenus: null,
  },
  {
    icon: 'contract',
    name: ' Sistema',
    router: moduloSuperadminSistema,
    parent: null,
    submenus: null,
  },
  {
    icon: 'contract',
    name: ' Relatórios',
    router: moduloSuperadminRelatorio,
    parent: null,
    submenus: null,
  },
  {
    icon: 'contract',
    name: 'Administrativo',
    router: moduloAdmin,
    parent: null,
    submenus: null,
  },
  {
    icon: 'contract',
    name: ' Assinaturas/Planos',
    router: moduloSuperadminAssinaturas,
    parent: moduloAdmin,
    submenus: null,
  },
  {
    icon: 'contract',
    name: 'Campos e Formulários',
    router: moduloAminCamposFormularios,
    parent: moduloAdmin,
    submenus: null,
  },
  {
    icon: 'contract',
    name: 'Perfis de Usuários e Permissões',
    router: moduloAdminPerfil,
    parent: moduloAdmin,
    submenus: null,
  },
];
