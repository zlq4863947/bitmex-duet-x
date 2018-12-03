import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: '主界面',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: '回测',
    icon: 'nb-shuffle',
    link: '/pages/backtest',
  },
  {
    title: '设置',
    icon: 'nb-gear',
    link: '/pages/settings',
  },
];
