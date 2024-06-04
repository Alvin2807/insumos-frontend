import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Rules from './rules/index'
import VueSweetalert2 from 'vue-sweetalert2'

Vue.use(VueAxios, axios)
Vue.use(VueSweetalert2);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  Rules,
  render: h => h(App)
}).$mount('#app')
