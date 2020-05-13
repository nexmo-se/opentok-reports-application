import Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueAxios, axios);
Vue.use(VueSweetalert2);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');
