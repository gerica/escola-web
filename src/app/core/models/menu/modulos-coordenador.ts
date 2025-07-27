import { MenuItem } from "./menu-item";

export const moduloTurma = 'turma';
export const moduloProfessor = 'professor';

export const modulosCoordenador: MenuItem[] = [
  {
    icon: 'contract',
    name: 'Turma',
    router: moduloTurma,
    parent: null,
    submenus: null,
  },
  {
    icon: 'contract',
    name: 'Professor',
    router: moduloProfessor,
    parent: null,
    submenus: null,
  },
  

];

