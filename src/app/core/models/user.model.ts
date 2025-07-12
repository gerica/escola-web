import { UserRole } from './user-role.model';

export interface User {
  token: string;
  username: string;
  firstName: string;
  lastName?: string;
  roles?: UserRole[];
}
