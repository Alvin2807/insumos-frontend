import Vue from 'vue'

const rules = Vue.prototype.$rules = {

    required: [
        v => !!v || 'Campo obligatorio.',


    ],

    usuarioRules: [
        v => !!v || 'Por favor ingrese su usuario.'
    ],

    contraseñaRules: [
        v => !!v || 'Por favor ingrese su contraseña.'
    ],
    RulesEmail: [
        v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Correo invalido',
    ],



}

export default rules