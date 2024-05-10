<template>
  <div id="toolbar">
    <v-toolbar
      color="#091862"
      elevation="4"
      height="80px"
      dark
      
    >
      <v-spacer></v-spacer>
      <img height="70px"  src="../assets/ministerio.png"/>
      <h3 class="text-center mx-2" id="textoTitulo"> {{ tituloData }}</h3>
      <img height="70px" src="../assets/sistema.png"/>
      <v-spacer></v-spacer>
    </v-toolbar>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',

    data: () => ({
      titulo:-1
    }),

    computed: {
      tituloData(){
        return this.titulo -1 ? 'Sistema de Inventario y Control de Insumos' : ''
      }
    },
  }
</script>
<style>
#textoTitulo{
  font-family: "Times New Roman", Times, serif;
  font-size: 28px;
}

#toolbar{
  border-bottom: solid 5px yellow;
}
</style>
