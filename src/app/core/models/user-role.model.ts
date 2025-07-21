export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN_EMPRESA = 'ADMIN_EMPRESA',  // Administrador de uma empresa específica (o cliente final)
  COORDENADOR = 'COORDENADOR',
  PROFESSOR = 'PROFESSOR',
  FINANCEIRO = 'FINANCEIRO',
  RECEPCIONISTA = 'RECEPCIONISTA'
}

export const userRoles: UserRole[] = Object.values(UserRole);
