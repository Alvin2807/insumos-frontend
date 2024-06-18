<template>
    <v-app>
        <v-container>

            <v-toolbar flat id="toolbar">
                <v-toolbar-title>
                    <span id="tituloDato">Formulario de modelos</span>
                </v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <v-toolbar flat class="mt-5">
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    label="Buscar por modelo"
                    dense
                    prepend-icon="search"
                    type="text"
                    autocomplete="off"
                    color="#074976"
                >

                </v-text-field>
               
            </v-toolbar>
            <v-data-table
                :headers="campos"
                :items="desserts"
                :search="search"
                :loading="cargandoDatos"
                loading-text="Cargando por favor espere..."
            >
                <template v-slot:[`item.actions`]="{item}">
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
            <v-dialog
                v-model="dialog"
                persistent
                max-width="650px"
                transition="fab-transition"
            >
                <v-card>
                    <v-toolbar class="elevation-0">
                        <div class="text-left">
                            <h3 id="tituloFormulario">{{ tituloFormulario.toUpperCase() }}</h3>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            small
                            fab
                            id="btnModal"
                            @click="cerrarModal()"
                        >
                        X
                        </v-btn>
                    </v-toolbar>
                    <v-divider></v-divider>
                    <v-card-text>  
                        <v-form ref="validacionModelo">
                            <v-row class="mt-3">
                               <v-tooltip left>
                                    <template v-slot:activator="{on,attrs}">
                                        <v-col
                                            cols="12"
                                            sm="6"
                                        >
                                        <v-text-field
                                            v-model="editedItem.marca"
                                            color="#074976"
                                            type="text"
                                            autocomplete="off"
                                            label="Marca"
                                            readonly
                                            class="caption my-input"
                                            v-on="on"
                                            v-bind="attrs"
                                        >
                                        </v-text-field>
                                        </v-col>

                                        <v-col
                                            cols="12"
                                            sm="6"
                                        >
                                        <v-text-field
                                            v-model="editedItem.modelo"
                                            color="#074976"
                                            type="text"
                                            autocomplete="off"
                                            label="Modelo"
                                            class="caption my-input"
                                        >
                                        </v-text-field>
                                        </v-col>
                                    </template>
                                    <span>Solo Lectura</span>
                               </v-tooltip>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="#1A5276"
                            class="white--text pa-5 elevation-0"
                            :loading="btnEditar"
                            @click="guardar()"
                        >
                        guardar cambios
                        </v-btn>
                    </v-card-actions>
                </v-card>

            </v-dialog>
        </v-container>


    </v-app>
</template>
<script src="sweetalert2.all.min.js"></script>
<script>
import API from '@/api'
import { mapState } from 'vuex';
import 'sweetalert2/dist/sweetalert2.min.css';
export default {
    data() {
        return {
            search:'',
            cargandoDatos:true,
            overlay:false,
            editedIndex:-1,
            dialog:false,
            titulo:-1,
            btnEditar:false,
            editedItem:{
                usuario:'',
                fk_marca:'',
                marca:'',
                modelo:'',
                id_modelo:''
            },
            opacity:0,
            campos:
            [
                {text:'Modelo de impresora',value:'modelo', class:'blue-grey lighten-4'},
                {text:'Marca', value:'marca', class:'blue-grey lighten-4', filter:false},
                {text:'Editar', value:'actions', class:'blue-grey lighten-4'}
            ],
            desserts:[]
        }
    },

    computed: {
        ...mapState(['loginDatos']),
        tituloFormulario(){
            return this.titulo -1 ? 'formulario de editar modelo':''
        }
    },

    mounted() {
        this.informacion()
    },

    methods: {
        informacion(){
            const usuario = localStorage.getItem('usuario')
            if (!usuario) {
                this.$router.push({path:'/'})
            }
            this.loginDatos.usuario = usuario
            this.mostrtarData()
        },

       async mostrtarData(){
            this.cargandoDatos = true
            const respuesta = await API.get('modelos')
            this.desserts = respuesta.data.data
            this.cargandoDatos = false
            return;
        },

        editar(item){
            this.overlay = true
            setTimeout(()=>{
                this.overlay = false
                Swal.fire({
                    icon:'question',
                    title:'¿Estas seguro de editar este modelo?',
                    showCancelButton:true,
                    confirmButtonColor:'#239B56',
                    cancelButtonColor:'#C0081F',
                    confirmButtonText:'Sí',
                    cancelButtonText:'No'
                }).then((result)=>{
                    if (result.isConfirmed) {
                        this.dialog = true
                        this.editedIndex = this.desserts.indexOf(item)
                        this.editedItem  = Object.assign({},item)
                    }
                })
            },1500)
        },

        cerrarModal(){
            this.dialog = false
            this.limpiar()
        },

        limpiar(){
            this.$refs.validacionModelo.reset()
            this.$refs.validacionModelo.resetValidation()
        },

       async guardar(){
            if (this.$refs.validacionModelo.validate()) {
                this.btnEditar = true
                setTimeout(()=>{
                    this.btnEditar = false
                    this.editedItem.usuario = this.loginDatos.usuario
                    const guardarDatos = async()=>{
                        try {
                            const respuesta = await API.put('editar_modelo', this.editedItem)
                            if (respuesta.data.ok == true) {
                                if (respuesta.data.existe) {
                                    this.mensajeExiste(respuesta.data.existe)
                                } else {
                                    this.mensajeExitoso(respuesta.data.exitoso)
                                    this.mostrtarData()
                                    this.cerrarModal()
                                }
                            } else if (respuesta.data.ok == false) {
                                this.mensajeError(respuesta.data.errorModificado)
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
                    return guardarDatos();
                },1500)
            }
        },

        mensajeExiste(existe){
            Swal.fire({
                icon:'info',
                text:existe,
                showConfirmButton:false,
                timer:1500

            })
        },

        mensajeExitoso(exitoso){
            Swal.fire({
                icon:'success',
                text:exitoso,
                showConfirmButton:false,
                timer:1500
            })
        },

        mensajeError(errorModificado){
            Swal.fire({
                icon:'error',
                title:error,
                showConfirmButton:false,
                timer:errorModificado
            })
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

#tituloFormulario{
    color: #1A5276;
    font-family: "Trebuchet MS", Helvetica, sans-serif;
    font-size: 15px;  
}

#btnModal:hover{
    background-color: red;
}

.my-input input{
    text-transform: uppercase;
}
</style>