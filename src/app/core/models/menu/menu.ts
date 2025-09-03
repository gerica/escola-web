import { UserRole } from "../user-role.model";
import { MenuItem } from "./menu-item";
import { modulos } from "./modulos-comum";
import { modulosPorPerfil } from "./modulos-perfil";

export class Menu {
  static montarMenuPorPerfis(perfis: UserRole[] | undefined): MenuItem[] {
    // perfis = [UserRole.ADMIN];
    // console.log(perfis);
    const identifieres = (perfis || []).map(p => modulosPorPerfil[UserRole[p]]).flat();
    // console.log(identifieres);
    // const funcoesHabilitadas = modulos.filter(f => identifieres.includes(f.router)) || [];
    const funcoesHabilitadas = modulos
      .filter(f => identifieres.includes(f.router))
      // .sort((a, b) => a.order - b.order);
      .sort((a, b) => {
        // 1. Compare a propriedade 'order' primeiro
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        const nomeA = a.name || ''; // Usa uma string vazia se o nome for nulo
        const nomeB = b.name || ''; // Usa uma string vazia se o nome for nulo
        return nomeA.localeCompare(nomeB);
      });

    // console.log(funcoesHabilitadas);
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
        const pai = itensMenu.find(m => m.router === f.parent);
        if (pai) {
          pai.submenus?.push({
            ...f,
            submenus: [],
          });
        }
      }
    });
    // console.log(itensMenu);
    return itensMenu;
  }
}
