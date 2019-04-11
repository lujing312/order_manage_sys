import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/components/Home'),
      children: [{
        path: '/storage',
        name: 'storage',
        component: () => import('@/components/Storage')
      }, {
        path: '/shipping',
        name: 'shipping',
        component: () => import('@/components/Shipping')
      }, {
        path: '/refund',
        name: 'refund',
        component: () => import('@/components/Refund')
      }, {
        path: '/order',
        name: 'order',
        component: () => import('@/components/Order')
      }]
    }
  ]
})
