import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '无尽冬日2808国战备战',
  },
  routes: [
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
      path: '/alliance',
      component: './Alliance',
    },
    {
      name: '国战预约',
      path: '/teservation',
      component: './Reservation',
    },
    {
      name: '堡垒规则',
      path: '/rules',
      component: './Rules',
    },
  ],
  npmClient: 'pnpm',
});
