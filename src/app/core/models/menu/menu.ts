import { UserRole } from "../user-role.model";
import { MenuItem } from "./menu-item";
import { modulos } from "./modulos-comum";
import { modulosPorPerfil } from "./modulos-perfil";

export class Menu {
  static montarMenuPorPerfis(perfis: UserRole[] | undefined): MenuItem[] {
    // perfis = [UserRole.ADMIN];
    // console.log(perfis);
    const identifieres = (perfis || []).map(p => modulosPorPerfil[UserRole[p]]).flat();
    const funcoesHabilitadas = modulos.filter(f => identifieres.includes(f.router)) || [];
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
