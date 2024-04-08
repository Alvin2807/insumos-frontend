<template>
    <v-app>
        <hello-world/>
       <v-container>
        <v-layout wrap>
            <v-flex sm12 md6 offset-md3>
                <v-card elevation="4" light tag="section">
                    <v-card-title>
                        <v-layout align-center justify-space-between>
                            <h3 class="headline">
                                {{ tituloData }}
                            </h3>
                        </v-layout>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-form>
                            <v-text-field
                                outlined
                                label="Usuario"
                                type="text"
                                prepend-inner-icon="account_circle"
                                autocomplete="off"
                                placeholder="Ingrese su usuario"
                            >

                            </v-text-field>

                            <v-text-field
                            
                            >

                            </v-text-field>
                        </v-form>
                    </v-card-text>

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
            titulo:-1
        }
    },

    computed: {
        tituloData(){
            return this.titulo === -1 ? 'Sistema de Control de Insumos' : ''
        }
    },
}
</script>