<template>
    <v-app id="inspire">
     <v-navigation-drawer
       v-model="drawer"
       app
     
     >
       <v-navigation-drawer permanent>
         <v-list-item>
           <v-icon size="60">account_circle</v-icon>
           <v-list-item-content>
           
             <v-list-item-title class="subtitle-2">
               {{ loginDatos.name }} {{ loginDatos.apellido }}
             </v-list-item-title>
            
           </v-list-item-content>
         </v-list-item>
   
         <v-divider></v-divider>
   
         <v-list
           dense
           nav
         >
           <v-list-item
             v-for="item in items"
             :key="item.title"
             link
             :to="item.path"
           >
             <v-list-item-icon>
               <v-icon>{{ item.icon }}</v-icon>
             </v-list-item-icon>
   
             <v-list-item-content>
               <v-list-item-title>{{ item.title }}</v-list-item-title>
             </v-list-item-content>
           </v-list-item>
         </v-list>
       </v-navigation-drawer>
   
     </v-navigation-drawer>
   
     <v-app-bar app color="#074976" dark>
       <v-app-bar-nav-icon @click="drawer = ! drawer"></v-app-bar-nav-icon>
       <v-spacer></v-spacer>
         <img class="mx-2"  height="60" src="../assets/ministerio.png"/>
         <span>Sistema Inventario de Control e Insumos</span>
         <img class="mx-1" height="60" src="../assets/sistema.png"/>
       <v-spacer></v-spacer>
     </v-app-bar>
     <router-view/>
    </v-app>
   </template>
   <script>
   import { mapState } from 'vuex';
   import { mapMutations } from 'vuex';
   export default {
     data() {
       return {
         drawer:null,
         items: [
             { title: 'Categorías', icon: 'mdi-view-dashboard', path:'/categorias' },
             { title: 'Marcas', icon: 'apps', path:'/marcas' },
             { title: 'About', icon: 'mdi-help-box' },
           ],
           right: null,
       }
     },
   
     mounted() {
       this.mostrarPerfil()
     },
   
     computed: {
       ...mapState(['loginDatos'])
     },
   
     methods: {
       ...mapMutations(['mostrarDetallesLogin']),
       mostrarPerfil: function(){
         const detallesLogin = localStorage.getItem('usuario');
         this.mostrarDetallesLogin(JSON.parse(detallesLogin))
       }
     },
     
   }
   </script>