<template>
    <v-app>
       <v-container>
        <v-toolbar flat id="toolbar">
                        <v-toolbar-title>
                            <span>Formulario de Categoría</span>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-divider></v-divider>
                <v-form ref="validacion">
                    
                    <v-row class="mt-3">
                        <v-col
                            cols="12"
                            sm="6"
                        >
                        
                        <v-text-field
                            v-model="editedItem.categoria"
                            color="#074976"
                            label="Nombre de categoría"
                            autocomplete="off"
                            :rules="$rules.required"
                            class="caption my-input"
                            type="text"
                            maxLength="100"
                        >
                        </v-text-field>
                        </v-col>
                        <v-btn-toggle
                            v-model="botones"
                        >
                            <v-btn
                                dark
                                color="green"
                                @click="registrar()"
                            >
                            registrar
                            </v-btn>
                            <v-btn
                                dark
                                color="info"
                            >
                                guardar cambios
                            </v-btn>

                        </v-btn-toggle>
                    </v-row>
                </v-form>
                <v-toolbar flat>
                    <v-spacer></v-spacer>
                    <v-col
                        cols="12"
                        sm="6"
                    >
                        <v-text-field
                            label="Buscar"
                            autocomplete="off"
                            color="#074976"
                            type="text"
                            v-model="search"
                            prepend-icon="search"
                            dense
                        >

                        </v-text-field>
                    </v-col>
                   
                </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="desserts"
                :search="search"
                class="mt-3"
                :loading="datos"
            >
                <template v-slot:[`item.actions`] = "{item}">
                   <v-btn
                    small
                    fab
                    dark
                    text
                    color="#1B2631"
                    @click="editar(item)"
                   >
                    <v-icon>edit</v-icon>
                   </v-btn>
                </template>
            </v-data-table>

            <v-overlay
                :value="overlay"
                :opacity="opacity"
            >
                <v-progress-circular
                    indeterminate
                    size="150"
                    color="#1A5276"
                    width="15"
                >
                </v-progress-circular>
            </v-overlay>
           
     
       
       </v-container>
    </v-app>
</template>
<script src="sweetalert2.all.min.js"></script>
<script>
import { mapState } from 'vuex'
import API from '@/api'
import 'sweetalert2/dist/sweetalert2.min.css';
export default {
    data() {
        return {
            titulo:-1,
            desserts:[],
            overlay:false,
            datos:true,
            opacity:0,
            search:'',
            botones:null,
            headers:
            [
                {text:'Categoría', value:'categoria', class:'blue-grey lighten-4'},
                {text:'Editar', class:'blue-grey lighten-4', value:'actions'},
            ],
            editedItem:{
                categoria:'',
                usuario:''
            }
        }
    },

    computed: {
        ...mapState(['loginDatos']),
        titutloToolbar(){
            return this.titulo -1 ? 'Categorías' : ''
        }
    },

    mounted() {
        this.informacion()
    },

    methods: {
        informacion(){
            const usuarioLogin = localStorage.getItem('usuario')
            if (!usuarioLogin) {
                this.$router.push({path:'/'})
            }

            this.loginDatos.usuario = usuarioLogin
            this.mostrarCategoria()
        },

        async mostrarCategoria(){
            this.datos = true
            const respuesta = await API.get('categoria')
            this.desserts = respuesta.data.data
            this.datos = false
            return
        },

        async registrar(){
            if (this.$refs.validacion.validate()) {
                this.overlay = true
                setTimeout(()=>{
                    this.overlay = false
                    const registrar = async () =>{
                    try {
                       this.editedItem.usuario = this.loginDatos.usuario
                       const respuesta = await API.post('categoria', this.editedItem) 
                       if (respuesta.data.ok == true) {
                           if (respuesta.data.existe) {
                               this.mensajeExisteRegistro(respuesta.data.existe)
                           } else {
                               this.mostrarCategoria()
                               this.mensajeRegistroExitoso(respuesta.data.exitoso)
                               this.limpiar()
                           }
                       } else if (respuesta.data.ok == false) {
                           this.mensajeErrorCategoria(respuesta.data.error)
                       }
                    } catch (error) {
                        if (error) {
                            Swal.fire({
                                icon:'error',
                                title:'hubo un error con el administrador del sistema',
                                showConfirmButton:false,
                                timer:1500
                            })
                        }
                    }
                }
                return registrar()
                },3000)
            }
           
        },

        mensajeExisteRegistro(existe){
            Swal.fire({
                icon:'info',
                text:existe,
                showConfirmButton:false,
                timer:2000
            })
        },

        mensajeRegistroExitoso(exitoso){
            Swal.fire({
                icon:'success',
                text:exitoso,
                showConfirmButton:false,
                timer:1500
            })
        },

        limpiar(){
            this.$refs.validacion.resetValidation()
            this.$refs.validacion.reset()
        },

        mensajeErrorCategoria(error){
            Swal.fire({
                icon:'error',
                title:error,
                showConfirmButton:false,
                timer:1500
            })
        }
    },
}
</script>

<style>
#toolbar{
    border-left: solid #074976 5px;
}

#tituloCss{
    font-family: "Trebuchet MS", Helvetica, sans-serif;
}

.my-input input{
    text-transform: uppercase;
}
</style>