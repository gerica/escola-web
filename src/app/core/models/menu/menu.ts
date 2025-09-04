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
    const funcoesHabilitadas = modulos.filter(f => identifieres.includes(f.router)) || [];

    // console.log(funcoesHabilitadas);
    const itensMenu: MenuItem[] = [];
    // 2. Itera sobre todos os módulos para encontrar os de primeiro nível
    funcoesHabilitadas.map(f => {
      if (!f.parent) {
        itensMenu.push({
          ...f,
          submenus: [],
        });
      }
    });

    // 3. Separa o item 'Início' do restante da lista
    const itemInicio = itensMenu.find(item => item.name === 'Início');
    const outrosItens = itensMenu.filter(item => item.name !== 'Início');

    // 4. Ordena o restante dos itens por nome em ordem alfabética
    outrosItens.sort((a, b) => a.name.localeCompare(b.name));

    // 5. Cria uma nova lista e adiciona o 'Início' no começo, seguido pelos outros itens ordenados
    let menuFinal: MenuItem[] = [];
    if (itemInicio) {
      menuFinal.push(itemInicio);
    }
    menuFinal = menuFinal.concat(outrosItens);

    // 6. Preenche os submenus nos itens já ordenados
    funcoesHabilitadas.map(f => {
      if (f.parent) {
        // Encontra o item pai na lista já ordenada
        const pai = menuFinal.find(m => m.router === f.parent);
        if (pai) {
          pai.submenus?.push({
            ...f,
            submenus: [],
          });
        }
      }
    });

    return menuFinal;
  }
}
