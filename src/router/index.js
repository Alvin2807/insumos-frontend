import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import store from '../store'




Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/inicio',
    name: 'Inicio',

    component:() =>
    import('../views/Inicio.vue'),
    children:
    [
      {
        path:'/categorias',
        name:'Categorias',

          component: ()=>
            import('../views/Categorias.vue'),
            meta:{requireAuth: false}
      },

      {
        path:'/marcas',
        name:'Marcas',

          component: ()=>
            import('../views/Marcas.vue'),
            meta:{requireAuth: false}
      },

      {
        path:'/modelos',
        name:'Modelos',

          component: ()=>
            import('../views/Modelos.vue'),
          meta:{require:false}
      }
    ]
   
  
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // Usamos to para verificar si requiera autenticación
  const protectedRoute = to.meta.requireAuth ? to.meta.requireAuth : false
      // Procedemos a verificar el token
  if (protectedRoute && store.state.loginDatos.usuario === '') {
      next({ name: 'Login' })
  } else {
      next()
  }


})

export default router
