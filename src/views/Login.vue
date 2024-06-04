<template>
 <v-app id="fondo">
  <div class="text-center mt-16" id="titulo">
    <img  class="mr-3" height="80" src="../assets/ministerio.png">
    <img  class="mx-3" height="70" :src="require('../assets/sistema.png')"/>
  <h3 class="white--text" id="sistema">Sistema de Inventario de Control e Insumos</h3>
  </div>

  <v-card width="430" class="mx-auto elevation-5 caption mt-5">
    <v-card-text>
      <div class="text-center">
          <h3 class="mt-5" id="iniciar">Iniciar Sesión</h3>
      </div>
        <v-divider class="mt-3"></v-divider>
        <v-container>
            <v-form ref="validacion">
                <v-row class="mt-2">
                    <v-col
                        cols="12"
                        sm="6"
                        md="12"
                    >
                        <v-text-field
                            v-model="editedItem.usuario"
                            label="Usuario"
                            prepend-inner-icon="account_circle"
                            color="#074976"
                            autocomplete="off"
                            class="text-sm-body-2"
                            outlined
                            id="usuario"
                            dense
                            height="50px"
                            :rules="$rules.usuarioRules"
                        >
                        </v-text-field>
                    </v-col>

                    <v-col
                        cols="12"
                        sm="6"
                        md="12"
                    >
                        <v-text-field
                            v-model="editedItem.password"
                            label="Contraseña"
                            prepend-inner-icon="mdi-lock" 
                            color="#074976"
                            autocomplete="off"
                            :type="showPassword ? 'text' : 'password'"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="showPassword = ! showPassword"
                            id="contraseña"
                            outlined
                            dense
                            class="text-sm-body-2"
                            height="50px"
                            :rules="$rules.contraseñaRules"
                        >
                        </v-text-field>
                    </v-col>
                </v-row>
            </v-form>

            <v-card-actions>
                <!-- accederSistema-->
                <v-spacer></v-spacer>
              <v-btn
                  class="white--text elvevation-0"
                  :loading="loading"
                  :disabled="loading"
                  width="150px"
                  color="#0F0C5F"
                  x--large
                  height="45px"
                  @click="accederSistema()"
              >
                  Entrar
              </v-btn>
              
            </v-card-actions>
        </v-container>
    </v-card-text>
  </v-card>

 </v-app>
</template>
<script src="sweetalert2.all.min.js"></script>
<script>
import { mapMutations } from 'vuex';
import 'sweetalert2/dist/sweetalert2.min.css';
import API from '@/api'
export default {
  data () { 
        return { 
           editedTitulo:-1,
            loader: null,
            loading: false,
            showPassword: false,
            editedItem: { 
              usuario:'',
              password:''
            }
          
         
        }
    },

    watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 2000)

        this.loader = null
      }
    },


    computed: {
      
    },

    methods: {
      ...mapMutations(['mostrarDetallesLogin']),
      accederSistema(){
        if (this.$refs.validacion.validate()) {
          this.loader = 'loading'
          API 
          .post('iniciar_seccion', this.editedItem)
          .then(respuesta=>{
            if (respuesta.data.ok) {
              this.mostrarDetallesLogin(respuesta.data.data)
              localStorage.setItem('usuario',JSON.stringify(respuesta.data.data))
              this.$router.push({path:'/inicio'})
            } else {
              this.mensajeErrorSesion(respuesta.data.message)
            }
          })
        }
      },

      mensajeErrorSesion(message){
        Swal.fire({
          icon:'error',
          title: message,
          showConfirmButton:false,
          timer:1500
        })
      }
    },

}
</script>
<style>
#fondo {
  background-image: linear-gradient(#0F0C5F , white,#0F0C5F);
}
#sistema{
  font-family: "Times New Roman", Times, serif;
  font-size: 35px;
}


</style>