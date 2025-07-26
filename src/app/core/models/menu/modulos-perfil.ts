import { moduloAdminNotificacao, moduloAdminParametros, moduloAdminTabelasAuxiliares, moduloAdminTipoDocumentosModelos, moduloCliente, moduloClienteContrato, moduloClienteNovo } from "./modulos-admin-empresa";
import { moduloInicial } from "./modulos-comum";
import { moduloAdmin, moduloAdminPerfil, moduloAminCamposFormularios, moduloSuperadminAssinaturas, moduloSuperadminEmpresa, moduloSuperadminRelatorio, moduloSuperadminSistema, moduloUsuario } from "./modulos-superadmin";

export const modulosPorPerfil = {
  SUPER_ADMIN: [
    moduloInicial,
    moduloSuperadminEmpresa,
    moduloUsuario,
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
    moduloUsuario,
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


