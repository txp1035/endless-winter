import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '无尽冬日',
  },
  routes: [
    {
      path: '/',
      redirect: '/table',
    },

    {
      name: '2808国战备战排名',
      path: '/table',
      component: './Table',
    },
  ],
  npmClient: 'pnpm',
});
