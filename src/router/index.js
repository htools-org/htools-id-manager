import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },

  // The Test page may be outdated, but not really required, so is disabled.
  // {
  //   path: '/test',
  //   name: 'Test',
  //   component: Test,
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
