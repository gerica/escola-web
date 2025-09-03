import { MenuItem } from "./menu-item";
import { moduloAdmin } from "./modulos-superadmin";

export const moduloInicial = 'inicio';
export const moduloCliente = 'cliente';
export const moduloClienteNovo = 'cliente/novo';
export const moduloClienteContrato = 'cliente/contrato';
export const moduloAdminParametros = 'administrativo/parametros';
export const moduloAdminCargo = 'administrativo/cargo';
export const moduloAdminCurso = 'administrativo/curso';
export const moduloTurma = 'turma';
export const moduloAdminTipoDocumentosModelos = 'administrativo/modelos-documentos';
export const moduloAdminTabelasAuxiliares = 'administrativo/tabelas-auxiliares';
export const moduloAdminNotificacao = 'administrativo/notificacoes';
export const moduloAdminAssinaturas = 'administrativo/assinaturas';
export const moduloAdminEmpresa = 'administrativo/empresa/:id';
export const moduloRelatorio = 'relatorio'

export const modulosAdminEmpresa: MenuItem[] = [
  {
    icon: 'contract',
    name: 'Cliente',
    router: moduloCliente,
    parent: null,
    submenus: null,
    order: 1,
  },
  {
    icon: 'contract',
    name: 'Gestão',
    router: moduloClienteNovo,
    parent: moduloCliente,
    submenus: null,
    order: 2,
  },
  {
    icon: 'contract',
    name: ' Empresa',
    router: moduloAdminEmpresa,
    parent: moduloAdmin,
    submenus: null,
    order: 3,
  },
  {
    icon: 'contract',
    name: 'Contrato',
    router: moduloClienteContrato,
    parent: moduloCliente,
    submenus: null,
    order: 4,
  },
  {
    icon: 'contract',
    name: 'Cargo',
    router: moduloAdminCargo,
    parent: moduloAdmin,
    submenus: null,
    order: 5,
  },
  {
    icon: 'contract',
    name: 'Curso',
    router: moduloAdminCurso,
    parent: moduloAdmin,
    submenus: null,
    order: 6,
  },
  {
    icon: 'contract',
    name: 'Turma',
    router: moduloTurma,
    parent: null,
    submenus: null,
    order: 7,
  },
  {
    icon: 'contract',
    name: 'Parâmetros Globais',
    router: moduloAdminParametros,
    parent: moduloAdmin,
    submenus: null,
    order: 8,
  },
  {
    icon: 'contract',
    name: 'Tipos de Documentos e Modelos',
    router: moduloAdminTipoDocumentosModelos,
    parent: moduloAdmin,
    submenus: null,
    order: 9,
  },
  {
    icon: 'contract',
    name: 'Tabelas Auxiliares/Listas de Seleção',
    router: moduloAdminTabelasAuxiliares,
    parent: moduloAdmin,
    submenus: null,
    order: 10,
  },
  {
    icon: 'contract',
    name: 'Notificações e Regras de Comunicação',
    router: moduloAdminNotificacao,
    parent: moduloAdmin,
    submenus: null,
    order: 11,
  },
  {
    icon: 'contract',
    name: ' Relatórios',
    router: moduloRelatorio,
    parent: null,
    submenus: null,
    order: 12,
  },



];


// Gestão de Empresas:
// Gestão de Usuários Globais:
// Configurações do Sistema:
// Relatórios e Análises:
