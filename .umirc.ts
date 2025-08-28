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
      redirect: '/personal',
    },
    {
      name: '个人排名',
      path: '/personal',
      component: './Personal',
    },
    {
      name: '联盟排名',
      path: '/alliance',
      component: './Alliance',
    },
    {
      name: '堡垒规则',
      path: '/rules',
      component: './Rules',
    },
  ],
  npmClient: 'pnpm',
});
