<template>
    <v-app id="fondo">
        <hello-world/>
       <v-container>
        <v-layout wrap >
        <v-flex sm12 md6 offset-md3 class="pa-16" align="center" justify="center">
          <v-card elevation="6" light tag="section" max-width="400px" class="mx-auto">
            <v-card-title>
              <v-layout align-center justify-space-between>
                <h3 id="iniciarSesion">{{ iniciarTitulo }}</h3>
              </v-layout>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-form>
                <v-text-field
                    prepend-icon="account_circle"
                    label="Usuario"
                    type="text"
                    color="#091862"
                    :rules="campoObligatorio"
                >
                </v-text-field>
                <v-text-field
                    color="#091862"
                    prepend-icon="mdi-lock"
                    label="Contraseña"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = ! showPassword"
                    :rules="campoObligatorio"
                >
                </v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
              <v-spacer></v-spacer>
              <v-btn color="#091862" 
                dark
                id="btn"
                :large="$vuetify.breakpoint.smAndUp"
                @click="accederSistema()"
                >
               
                <v-icon left>
                    password
                </v-icon>
                Ingresar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
       </v-container>
    </v-app>
</template>
<script>
import HelloWorld from '../components/HelloWorld.vue'
export default {
    name:'Login',
    components:{
        HelloWorld
    },
    data() {
        return {
            titulo:-1,
            showPassword: false,
            campoObligatorio: 
            [
                v => !!v || 'Campo Obligatorio',
                
            ],
            
        }
    },

    computed: {
        iniciarTitulo(){
            return this.titulo -1 ? 'Iniciar Sesion' : ''
        }
    },

    methods: {
      accederSistema(){
        this.$router.push({path:'/inicio'})
      }
    },
}
</script>
<style>
#iniciarSesion{
    font-family: "Times New Roman", Times, serif;
    align-content: center;
}

#fondo{
    background-image: linear-gradient(#FDFEFE,#D8E7F6);
}

#btn:hover{
  color: yellow;
}

</style>