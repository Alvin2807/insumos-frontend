<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      class="elevation-0"
      color="grey lighten-5"
    >
    <v-list-item two-line>
        <v-list-item-avatar size="60">
        <v-icon size="70">account_circle</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="caption">
        <!--Usuario-->
            {{loginDatos.name}}   
            <v-list-item-subtitle>
            {{loginDatos.apellido}}
            </v-list-item-subtitle>
          </v-list-item-title>
        </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list>
      <v-list-group
        v-for="item in items"
        :key="item.title"
        v-model="item.active"
        :prepend-icon="item.action"
        no-action
        color="#1A5276"
       
      >
     
        <template v-slot:activator>
          <v-list-item-content>
             <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="child in item.items"
          :key="child.title"
          color="#1A5276"
          link
          :to="child.path"
        >
          <v-list-item-content>
            <v-list-item-title>{{ child.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="#1A5276" height="70px" dark class="elevation-0">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title>
        <img  class="mr-3" height="50" :src="require('../assets/ministerio.png')"/>
        <span id="tituloSistema">Sistema Inventario de Control e Insumos</span>
        <img  class="mx-3" height="50" :src="require('../assets/sistema.png')"/>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <router-view/>
  </v-app>
</template>
<script>
import { mapState,mapMutations} from 'vuex';
export default {
  data() {
    return {
      drawer:null,
      items: [
        /* {
          action: 'shopping_cart',
          items: 
          [
            {title: 'Orden de Compra', path:'/orden-de-compra',},
            {title:'Caja Menuda', path:'/caja-menuda'},
            {title: 'Solicitudes', path:'/mis_solicitudes'},
          ],
          title: 'Solicitud',
          roles: 1,
        }, */
        /* {
          action: 'article',
          active: false,
          items: 
          [
          { title: 'Artículos',path:'/articulos', },
            {title: 'Ubicaciones', path:'/ubicaciones'},
            {title:'Artículos en almacén', path:'/articulos-en-almacen'}
          ],
          title: 'Artículos',
        }, */
        {
          action: 'grid_view',
          items: 
          [
            {title: 'Marcas', path:'/marcas' },
            {title: 'Modelos', path:'/modelos' },
            {title:'Categorías', path:'/categorias'},

          /*   {title: 'Grupos', path:'/grupos'},
            {title: 'SubGrupos', path:'/subgrupos' },
            {title: 'Colores',path:'/colores' },
            {title: 'Unidad de Medida', path:'/unidades-de-medidas' },
            {title: 'Porcentajes', path:'/porcentajes'},
            {title: 'Depositos', path:'/depositos' },
            {title: 'Localizaciones', path:'/localizaciones' }, */
          ],
          title: 'Parametros',
        },
        {
          action: 'dataset',
          items: 
          [
            {title: 'Nomenclaturas', path:'/nomenclaturas'},
            {title: 'Insumos', path:'/insumos'},
          ],
          title: 'Productos',
        },
       
       /*  {
          action: 'receipt_long',
          active: false,
          items: [
            {title: 'Traspaso de salida', path:'/traspaso_de_salida' },
            {title: 'Traspaso de Entrada', path:'/traspaso_de_entrada' },
            {title: 'Nota de Entrega', path:'/nota_de_entrega' },
          ],
          title: 'Traspasos',
          roles: 1,
        }, */

        
      ],
    }
  },

  computed: {
    ...mapState(['loginDatos'])
  },

  mounted() {
    this.mostrarPerfil()
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
<style>
#tituloSistema{
  font-family: "Trebuchet MS", Helvetica, sans-serif;
}

#usuarioPerfil{
   font-family: "Trebuchet MS", Helvetica, sans-serif;
   font-size: 15px;
}
</style>