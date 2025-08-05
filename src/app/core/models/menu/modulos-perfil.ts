import { moduloAdminCurso, moduloAdminEmpresa, moduloAdminNotificacao, moduloAdminParametros, moduloAdminTabelasAuxiliares, moduloAdminTipoDocumentosModelos, moduloCliente, moduloClienteContrato, moduloClienteNovo } from "./modulos-admin-empresa";
import { moduloInicial } from "./modulos-comum";
import { moduloProfessor, moduloTurma } from "./modulos-coordenador";
import { moduloConta, moduloContaPagar, moduloContaReceber } from "./modulos-financeiro";
import { moduloAdmin, moduloAdminPerfil, moduloAminCamposFormularios, moduloEmpresas, moduloSuperadminAssinaturas, moduloSuperadminRelatorio, moduloSuperadminSistema, moduloUsuario } from "./modulos-superadmin";

export const modulosPorPerfil = {
  SUPER_ADMIN: [
    moduloInicial,
    moduloEmpresas,
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
    // moduloAdminCargo,
    moduloAdminEmpresa,
    moduloAdminCurso,
    moduloTurma,
    moduloAdminPerfil,
    moduloAdminParametros,
    moduloAdminTipoDocumentosModelos,
    moduloAdminTabelasAuxiliares,
    moduloAdminNotificacao,
  ],
  COORDENADOR: [
    moduloInicial,
    moduloTurma,
    moduloProfessor,
  ],
  PROFESSOR: [],
  FINANCEIRO: [
    moduloInicial,
    moduloCliente,
    moduloClienteContrato,
    moduloConta,
    moduloContaReceber,
    moduloContaPagar
  ],
  RECEPCIONISTA: [],
};


