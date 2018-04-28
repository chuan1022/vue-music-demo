import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main'
import recommend from '@/components/recommend'
import singer from '@/components/singer'
import rank from '@/components/rank'
import search from '@/components/search'
import singerDetail from "@/components/singer-detail"
import discDetail from "@/components/disc-detail"
import topDetail from "@/components/top-detail"
// import player from "@/components/player"

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'main',
    component: main,
    children: [{
      path: '/',
      redirect: '/recommend'
    }, {
      path: '/recommend',
      component: recommend,
      children: [{
        path: ':id',
        component: discDetail
      }]
    }, {
      path: '/singer',
      component: singer,
      children: [{
        path: ':id',
        component: singerDetail
      }]
    }, {
      path: '/rank',
      component: rank,
      children:[{
        path:':id',
        component: topDetail
      }]
    }, {
      path: '/search',
      component: search
    }]
  }]
})
