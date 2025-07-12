import { UserRole } from "../user-role.model";
import { MenuItem } from "./menu-item";

const funcoesPorPerfil = {
  ADMIN: [
    'inicio',
    'cliente',
    'contrato',
    'administrativo',
  ],
  USER: [
    'inicio',    
    'contrato',
  ],
};

const listaFuncoes = [
  {
    icon: 'house',
    name: 'Início',
    router: 'inicio',
    identifier: 'inicio',
    parent: null,
  },
  {
    icon: 'contract',
    name: 'Contrato',
    router: 'contrato',
    identifier: 'contrato',
    parent: null,
  },
  {
    icon: 'contract',
    name: 'Cliente',
    router: 'cliente',
    identifier: 'cliente',
    parent: null,
  },
  {
    icon: 'contract',
    name: 'Administrativo',
    router: 'administrativo',
    identifier: 'administrativo',
    parent: null,
  },

];

export class Menu {
  static montarMenuPorPerfis(perfis: UserRole[] | undefined): MenuItem[] {
    // perfis = [UserRole.ADMIN];
    // console.log(perfis);
    const identifieres = (perfis || []).map(p => funcoesPorPerfil[UserRole[p]]).flat();
    const funcoesHabilitadas = listaFuncoes.filter(f => identifieres.includes(f.identifier)) || [];
    const itensMenu: MenuItem[] = [];
    funcoesHabilitadas.map(f => {
      if (!f.parent) {
        itensMenu.push({
          ...f,
          submenus: [],
        });
      }
    });
    // segundo nivel
    funcoesHabilitadas.map(f => {
      if (f.parent) {
        const pai = itensMenu.find(m => m.identifier === f.parent);
        if (pai) {
          pai.submenus.push({
            ...f,
            submenus: [],
          });
        }
      }
    });
    return itensMenu;
  }
}
