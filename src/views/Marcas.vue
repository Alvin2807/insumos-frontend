<template>
    <v-app>
        <v-container>
            <v-toolbar flat id="toolbar">
                <v-toolbar-title>
                    <span id="tituloDato">Formulario de Marcas y Modelos</span>
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
                            v-model="editedItem.marca"
                            label="Marca"
                            autocomplete="off"
                            color="#074976"
                            class="caption my-input"
                            type="text"
                            maxLength="100"
                            :rules="$rules.required"
                        >
                        </v-text-field>
                    </v-col>
                    <v-btn-toggle
                        v-model="botones"
                    >
                    <v-btn
                        class="white--text"
                        color="#074976"
                        @click="registrar()"
                    >
                    registrar
                    </v-btn>
                    <v-btn
                        dark
                        color="green"
                        @click="guardar()"
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
                :headers="campos"
                :items="desserts"
                :search="search"
                class="mt-3"
                :loading="datos"
                loading-text="Cragando por favor espere..."
            >
                <template v-slot:[`item.actions`] = "{item}">
                    <v-btn
                        fab
                        small
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
import 'sweetalert2/dist/sweetalert2.min.css';
import { mapState } from 'vuex';
import API from '@/api'
export default {
    data() {
        return {
            botones:null,
            datos:true,
            overlay:false,
            opacity:0,
            editedIndex:-1,
            campos:
            [
                {text:'Marca', value:'marca', class:'blue-grey lighten-4'},
                {text:'Editar', value:'actions',class:'blue-grey lighten-4'}
            ],
            desserts:[],
            search:'',
            editedItem:{
                marca:'',
                usuario:''
            }
        }
    },

    computed: {
        ...mapState(['loginDatos']),
    },

    mounted() {
        this.informacion();
    },

    methods: {
        informacion(){
            const usuario = localStorage.getItem('usuario');
            if (!usuario) {
                this.$routers.push({path:'/'})
            }
            this.loginDatos.usuario = usuario
            this.mostrarData();
            
        },

       async mostrarData(){
            this.datos = true
            const respuesta = await API.get('marcas')
            this.desserts = respuesta.data.data
            this.datos = false
            return;
        },

       async registrar(){
            if (this.$refs.validacion.validate()) {
                this.overlay = true
                setTimeout(()=>{
                    this.overlay = false
                    const registrarDatos = async()=>{
                        try {
                            this.editedItem.usuario = this.loginDatos.usuario
                            const respuesta = await API.post('marcas', this.editedItem)
                            if (respuesta.data.ok == true) {
                                if (respuesta.data.existe) {
                                    this.mensajeExisteRegistro(respuesta.data.existe)
                                } else {
                                    this.mensajeRegistrarExitoso(respuesta.data.exitoso)
                                    this.mostrarData()
                                    this.limpiar()
                                }
                            } else if (respuesta.data.ok == false) {
                                this.mensajeError(respuesta.data.errorRegistro)
                            }
                        } catch (error) {
                            if (error) {
                                Swal.fire({
                                    icon:'error',
                                    title:'Hubo un error consulte con el Administrador del sistema',
                                    showConfirmButton:false,
                                    timer:1500
                                })
                            }
                        }
                    }
                    return registrarDatos();
                },1500)
            }
        },

        mensajeRegistrarExitoso(exitoso){
            Swal.fire({
                icon:'success',
                text:exitoso,
                showConfirmButton:false,
                timer:1500
            })
        },

        mensajeExisteRegistro(existe){
            Swal.fire({
                icon:'info',
                text:existe,
                showConfirmButton:false,
                timer:1500
            })
        },

        mensajeError(errorRegistro){
            Swal.fire({
                icon:'error',
                title:errorRegistro,
                showConfirmButton:false,
                timer:1500
            })
        },

        limpiar(){
            this.$refs.validacion.resetValidation()
            this.$refs.validacion.reset()
        },

        editar(item){
            this.overlay = true
            setTimeout(()=>{
                this.overlay = false
                Swal.fire({
                    icon:'question',
                    title:'¿Estas seguro de editar está marca?',
                    showCancelButton:true,
                    confirmButtonColor:'#239B56',
                    cancelButtonColor:'#C0081F',
                    confirmButtonText:'Sí',
                    cancelButtonText:'No'
                }).then((result)=>{
                    if (result.isConfirmed) {
                        this.editedIndex = this.desserts.indexOf(item)
                        this.editedItem = Object.assign({},item)
                    }
                })
            },1500)
        },

        async guardar(){
            if (this.$refs.validacion.validate()) {
                this.overlay = true
                setTimeout(()=>{
                    this.overlay = false
                    const guardarDatos = async()=>{
                        try {
                            this.editedItem.usuario = this.loginDatos.usuario
                            const respuesta = await API.put('editar_marca', this.editedItem)
                            if (respuesta.data.ok == true) {
                                if (respuesta.data.existeMarca) {
                                    this.mensajeExisteEditarCategoria(respuesta.data.existeMarca)
                                } else {
                                    this.mensajeEditadoExitoso(respuesta.data.modificado)
                                    this.mostrarData()
                                    this.limpiar()
                                    //this.btnGuardar = true
                                }
                            } else if (respuesta.data.ok == false) {
                              this.mensajeErrorModifica(respuesta.data.errorModifica)  
                            }
                        } catch (error) {
                            if (error) {
                                Swal.fire({
                                    icon:'error',
                                    showConfirmButton:false,
                                    title:'Hubo un error consulte con el Administrador del sistema',
                                    timer:1500
                                })
                            }
                        }
                    }
                    return guardarDatos()
                    
                },1500)
            }
           
        },

        mostrarMensajeExisteEditado(existeMarca){
            Swal.fire({
                icon:'info',
                text:existeMarca,
                showConfirmButton:false,
                timer:false
            })
        },

        mensajeEditadoExitoso(modificado){
            Swal.fire({
                icon:'success',
                text:modificado,
                showConfirmButton:false,
                timer:1500
            })
        },

        mensajeErrorModifica(errorModifica){
            Swal.fire({
                icon:'error',
                title:errorModifica,
                showConfirmButton:false,
                timer:1500
            })
        },

        limpiar(){
            this.$refs.validacion.resetValidation()
            this.$refs.validacion.reset()
        }
    },

}
</script>
<style>
#tituloDato{
    font-family: Tahoma, Verdana, sans-serif;
}

#toolbar{
    border-left: solid #074976 5px;
}

.my-input input {
    text-transform: uppercase;
}
</style>