export interface MenuItem {
  icon: string;
  name: string;
  router: string;
  parent: string | null,
  submenus: MenuItem[] | null;
  order: number
}
