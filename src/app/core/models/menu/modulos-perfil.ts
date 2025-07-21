import { moduloAdminNotificacao, moduloAdminParametros, moduloAdminTabelasAuxiliares, moduloAdminTipoDocumentosModelos, moduloCliente, moduloClienteContrato, moduloClienteNovo } from "./modulos-admin-empresa";
import { moduloInicial } from "./modulos-comum";
import { moduloAdmin, moduloAdminPerfil, moduloAminCamposFormularios, moduloSuperadminAssinaturas, moduloSuperadminEmpresa, moduloSuperadminRelatorio, moduloSuperadminSistema, moduloSuperadminUsuario } from "./modulos-superadmin";

export const modulosPorPerfil = {
  SUPER_ADMIN: [
    moduloInicial,
    moduloSuperadminEmpresa,
    moduloSuperadminUsuario,
    moduloSuperadminSistema,
    moduloSuperadminRelatorio,
    moduloAdmin,
    moduloSuperadminAssinaturas,
    moduloAminCamposFormularios,
    moduloAdminPerfil,
  ],
  ADMIN_EMPRESA: [
    moduloInicial,
    moduloCliente,
    moduloClienteNovo,
    moduloClienteContrato,
    moduloAdmin,
    moduloAdminPerfil,
    moduloAdminParametros,
    moduloAdminTipoDocumentosModelos,
    moduloAdminTabelasAuxiliares,
    moduloAdminNotificacao,
  ],
  COORDENADOR: [],
  PROFESSOR: [],
  FINANCEIRO: [],
  RECEPCIONISTA: [],
};


