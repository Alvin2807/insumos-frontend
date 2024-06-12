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
                    <v-btn
                        small
                        dark
                        text
                        fab
                        color="#1B2631"
                        @click="agregar(item)"
                    >
                        <v-icon>add</v-icon>
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
                transition="fab-transition"
                max-width="650px"
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
                            <span class="font-weight-medium">Marca:
                                {{ editedItemModelos.marca }}
                            </span>
                            <v-row class="mt-3">
                               <v-tooltip right>
                                <template v-slot:activator="{on,attrs}">
                                    <v-btn
                                        small
                                        text
                                        color="teal"
                                        v-on="on"
                                        v-bind="attrs"
                                        @click="agregarModelo()"
                                    >
                                        <v-icon>add</v-icon>
                                    </v-btn>
                                </template>
                                <span>Agregar modelo</span>
                               </v-tooltip>
                            </v-row>

                            <div
                                v-for="(nombre_modelo, index) in editedItemModelos.modelos" 
                                v-bind:key="nombre_modelo + index"
                            >
                                <v-row class="mt-3">
                                    <v-col
                                        cols="12"
                                        sm="12"
                                    >
                                        <v-text-field
                                            v-model="nombre_modelo.modelo"
                                            label="Modelo de impresora"
                                            autocomplete="off"
                                            maxLength="100"
                                            type="text"
                                            color="#1A5276"
                                            class="caption my-input"
                                            dense
                                            :rules="$rules.required"
                                        >

                                        </v-text-field>

                                    </v-col>
                                    <div v-if="index > 0">
                                        <v-tooltip right>
                                            <template v-slot:activator="{on,attrs}">
                                               <v-btn
                                                    color="red"
                                                    text
                                                    fab
                                                    small
                                                    v-on="on"
                                                    v-bind="attrs"
                                                    @click="eliminarModelo()"
                                               >
                                                <v-icon>remove</v-icon>
                                               </v-btn>
                                              
                                            </template>
                                            <span>Eliminar</span>
                                        </v-tooltip>

                                    </div>
                                </v-row>

                            </div>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                             color="#1A5276"
                             class="white--text pa-5 elevation-0"
                             :loading="btnRegistrarModelo"
                            
                             @click="registrarModelo()"
                        >
                        registrar modelos
                        </v-btn>
                    </v-card-actions>
                </v-card>

            </v-dialog>
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
            dialog:false,
            datos:true,
            overlay:false,
            opacity:0,
            btnGuardar:true,
            editedIndex:-1,
            btnRegistrarModelo:false,
            titulo:-1,
            campos:
            [
                {text:'Marca', value:'marca', class:'blue-grey lighten-4'},
                {text:'Editar | Agregar modelo', value:'actions',class:'blue-grey lighten-4'},
            ],
            desserts:[],
            search:'',
            editedItem:{
                marca:'',
                usuario:''
            },

            editedItemModelos:{
                fk_marca:'',
                marca:'',
                modelos:
                [
                    {
                        modelo:'',

                    }
                ]
            }
        }
    },

    computed: {
        ...mapState(['loginDatos']),
        tituloFormulario(){
            return this.titulo -- -1 ? 'fomulario de modelo de impresora' : ''
        }
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
                            const respuesta = await API.put('editar_marca', this.editedItem)
                            if (respuesta.data.ok == true) {
                                if (respuesta.data.existeMarca) {
                                    this.mensajeExisteEditarCategoria(respuesta.data.existeMarca)
                                } else {
                                    this.mensajeEditadoExitoso(respuesta.data.modificado)
                                    this.mostrarData()
                                    this.limpiar()
                                    this.btnGuardar = true
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
        },

        agregar(item){
            this.overlay = true
            setTimeout(()=>{
                this.overlay = false
                this.editedItemModelos.modelos.length = 1
                this.editedItemModelos.fk_marca = item.id_marca
                this.editedItemModelos.marca = item.marca
                this.dialog = true
            },1500)
        },

        cerrarModal(){
            this.dialog = false
            this.limpiarModelo()
        },

        limpiarModelo(){
            this.$refs.validacionModelo.resetValidation()
            this.$refs.validacionModelo.reset()
        },

        agregarModelo(){
           this.editedItemModelos.modelos.push({
            modelo:''
           })
        },

        eliminarModelo(){
            this.editedItemModelos.modelos.splice(this.editedIndex, 1)
        },

        registrarModelo(){
            if (this.$refs.validacionModelo.validate()) {
                this.btnRegistrarModelo = true
                setTimeout(()=>{
                    this.btnRegistrarModelo = false
                    this.editedItemModelos.usuario = this.loginDatos.usuario
                    const registrarDatosModelo = async()=>{
                        try {
                            const respuesta = await API.post('modelos', this.editedItemModelos)
                            if (respuesta.data.ok == true) {
                                if (respuesta.data.existeModelo) {
                                    this.mensajeExisteModelo(respuesta.data.existeModelo)
                                } else {
                                    this.mensajeRegistroExitosoModelo(respuesta.data.registrarModelo)
                                    this.cerrarModal()
                                }
                            } else if (respuesta.data.ok == false) {
                                this.mensajeErrorRegistroModelo(respuesta.data.errorModelo)
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
                    return registrarDatosModelo()
                },1500)
            }
        },

        mensajeExisteModelo(existeModelo){
            Swal.fire({
                icon:'info',
                text:existeModelo,
                showConfirmButton:false,
                timer:1500
            })
        },

        mensajeRegistroExitosoModelo(registrarModelo){
            Swal.fire({
                icon:'success',
                text:registrarModelo,
                showConfirmButton:false,
                timer:1500
            })
        },

        mensajeErrorRegistroModelo(errorModelo){
            Swal.fire({
                icon:'error',
                title:errorModelo,
                showConfirmButton:false,
                timer:1500
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
    color: white;
}

.my-input input {
    text-transform: uppercase;
}
</style>