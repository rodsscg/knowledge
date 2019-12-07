import Vue from 'vue';

import 'font-awesome/css/font-awesome.css';

import App from './App.vue';
import store from './config/store';

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
