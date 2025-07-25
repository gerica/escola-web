import { Empresa } from 'src/app/shared/models/empresa';
import { UserRole } from './user-role.model';

export interface User {
  token: string;
  username: string;
  firstName: string;
  lastName?: string;
  roles?: UserRole[];
  precisaAlterarSenha?: boolean;
  empresa: Empresa; 
}
