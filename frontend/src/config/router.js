import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../components/home/Home.vue';
import AdminPages from '../components/admin/AdminPages.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [{
    name: 'home',
    path: '/',
    component: Home,
  }, {
    name: 'adminPages',
    path: '/admin',
    component: AdminPages,
  }],
});
