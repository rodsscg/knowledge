import Vue from 'vue';

import 'font-awesome/css/font-awesome.css';

import App from './App.vue';
import './config/bootstrap';
import './config/msgs';
import store from './config/store';
import router from './config/router';

Vue.config.productionTip = false;

// TODO: Temporário. Será adicionado a parte de autenticação posteriormente.
require('axios').defaults.headers.common.Authorization = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IlJvZHJpZ28iLCJlbWFpbCI6InJvZHJpZ29zYW50b3NjZ0BnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTc1ODE4MTcyLCJleHAiOjE1NzYwNzczNzJ9.amcDL1F-pOr7EleuoUROJosKOKGYY5VAQF_TAoCweBs';

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
