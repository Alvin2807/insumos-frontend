<template>
   <v-app>
    <v-container>
        <v-toolbar flat id="toolbar">
            <v-toolbar-title>
                <span id="tituloFormulario">{{ formularioTitulo }}</span>
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
                        v-model="editedItem.nomenclatura"
                        label="Nomenclatura"
                        type="text"
                        color="#074976"
                        class="caption my-input"
                        autocomplete="off"
                        maxLength="80"
                        :rules="$rules.required"
                    >
                    </v-text-field>
                </v-col>
                <v-btn-toggle v-model="botones">
                    <v-btn
                        class="white--text"
                        color="#074976"
                        @click="registrar()"
                    >
                        registrar
                    </v-btn>
                    <v-btn
                        class="white--text"
                        color="green"
                        :disabled="btnGuardar"
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
            :loading="cargando"
            :search="search"
            loading-text="Cargando por favor espere..."
        >
            <template v-slot:[`item.actions`]="{item}">
                <v-btn
                    small
                    fab
                    color="#1B2631"
                    dark
                    text
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
import { mapState } from 'vuex';
import API from '@/api'
import 'sweetalert2/dist/sweetalert2.min.css';
export default {
    data() {
        return {
            titulo:-1,
            botones:null,
            opacity:0,
            overlay:false,
            search:'',
            btnGuardar:true,
            editedIndex:-1,
            cargando:true,
            editedItem:{
                nomenclatura:'',
                usuario:''
            },
            desserts:[],
            campos:[
                {text:'Nomenclatura', value:'nomenclatura', class:'blue-grey lighten-4'},
                {text:'¿Insumo Agregado?', value:'producto_agregado', class:'blue-grey lighten-4'},
                {text:'Editar |', value:'actions', class:'blue-grey lighten-4'}
            ]
        }
    },

    computed: {
        ...mapState(['loginDatos']),
        formularioTitulo(){
            return this.titulo -1 ? 'Formulario de Nomenclaturas' : ''
        }
    },

    mounted() {
        this.informacion()
    },

    methods: {
        informacion(){
            const usuario = localStorage.getItem('usuario');
            if (!usuario) {
                this.$router.push({path:'/'})
            }
            this.loginDatos.usuario = usuario
            this.mostrarData();
        },

        async mostrarData(){
            this.cargando = true
            const respuesta = await API.get('nomenclaturas')
            this.desserts = respuesta.data.data
            this.cargando = false
            return;
        },

      async registrar() {
        if (this.$refs.validacion.validate()) {
            this.overlay = true
            setTimeout(()=>{
                this.overlay = false
                const registrarDatos = async()=>{
                    try {
                       this.editedItem.usuario = this.loginDatos.usuario 
                       const respuesta = await API.post('nomenclaturas', this.editedItem)
                       if (respuesta.data.ok == true) {
                        if (respuesta.data.existe) {
                            this.mensajeExiste(respuesta.data.existe)
                        } else {
                            this.mensajeExitoso(respuesta.data.exitoso)
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

        mensajeError(errorRegistro){
            Swal.fire({
                icon:'error',
                title:errorRegistro,
                showConfirmButton:false,
                timer:1500
            })
        },

        limpiar(){
            this.$refs.validacion.reset();
            this.$refs.validacion.resetValidation();
        },

        editar(item){
            this.overlay = true
            setTimeout(()=>{
                this.overlay = false
                Swal.fire({
                    icon:'question',
                    title:'¿Estas seguro de editar está nomenclatura?',
                    showCancelButton:true,
                    confirmButtonColor:'#239B56',
                    cancelButtonColor:'#C0081F',
                    confirmButtonText:'Sí',
                    cancelButtonText:'No'
                }).then((result)=>{
                    if (result.isConfirmed) {
                        this.editedIndex = this.desserts.indexOf(item)
                        this.editedItem  = Object.assign({},item)
                        this.btnGuardar = false
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
                            const respuesta = await API.put('editar_nomenclatura', this.editedItem)
                            if (respuesta.data.ok == true) {
                                if (respuesta.data.existeData) {
                                    this.mensajeExisteEditar(respuesta.data.existeData)
                                } else {
                                    this.mensajeEditarExitoso(respuesta.data.editado)
                                    this.mostrarData();
                                    this.limpiar();
                                    this.btnGuardar = true
                                }
                            } else if (respuesta.data.ok == false) {
                                this.mensajeEditarError(respuesta.data.errorModifica)
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

        mensajeExisteEditar(existeData){
            Swal.fire({
                icon:'info',
                text:existeData,
                showConfirmButton:false,
                timer:1500
            })
        },

        mensajeEditarExitoso(editado){
            Swal.fire({
                icon:'success',
                text:editado,
                showConfirmButton:false,
                timer:1500
            })
        },

        mensajeEditarError(errorModifica){
            Swal.fire({
                icon:'success',
                text:errorModifica,
                showConfirmButton:false,
                timer:1500
            })
        },
    },
}
</script>
<style>
#tituloFormulario{
    font-family: Tahoma, Verdana, sans-serif;
}

#toolbar{
    border-left: solid #074976 5px;
}

.my-input input{
    text-transform: uppercase;
}
</style>