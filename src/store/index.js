import Vue from 'vue'
import Vuex from 'vuex'
import API from '@/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginDatos:{
      apellido:'',
      name:'',
      usuario:'',
      correo:''
    },
    loginInfo: '',
  },
  getters: {
  },
  mutations: {
    mostrarDetallesLogin(state, payload) {
      state.loginDatos = payload
    },
    accederLogin(state, payload) {
      state.loginInfo = payload
  },
  },
  actions: {
    iniciarSession: function(context) {
      API
          .post('iniciar_seccion')
          .then(respuesta => {
              context.commit('accederLogin', respuesta.data)
          })
  }
  },
  modules: {
  }
})
