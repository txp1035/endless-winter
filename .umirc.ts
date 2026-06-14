import { defineConfig } from '@umijs/max';

import { IS_DEV } from './src/constants';

const routes = [
  {
    path: '/',
    redirect: '/521',
  },
  {
    name: '国战个人排名',
    path: '/521',
    component: './521',
  },
  {
    path: '/list',
    component: './521/List',
  },
  {
    name: '国战预约',
    path: '/teservation',
    component: './Reservation',
  },
  {
    name: '账号关联',
    path: '/account',
    component: './Account',
  },
  {
    name: '堡垒规则',
    path: '/rules',
    component: './Rules',
  },
];
if (IS_DEV) {
  routes.push({
    name: '管理页面',
    path: '/mine',
    component: './Mine',
  });
}

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '无尽冬日2808国战备战',
  },
  routes,
  npmClient: 'pnpm',
});
