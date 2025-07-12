export interface MenuItem {
  icon: string;
  name: string;
  router: string;
  submenus: MenuItem[];
  identifier: string;
}
