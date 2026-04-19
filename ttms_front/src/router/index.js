import { createRouter, createWebHistory } from 'vue-router'
import index from '@/views/index/index.vue'
import movie from '../views/movie/index.vue'
import user from '../views/user/index.vue'

const login = import('../views/login/indexPage.vue')
const movieDetail = import('../views/movieDetail/index.vue')
const movieDetailIntro = import('../views/movieDetail/movieDetailIntro.vue')
const movieDetailPerformer = import('../views/movieDetail/movieDetailPerformer.vue')
const movieDetailPicture = import('../views/movieDetail/movieDetailPicture.vue')
const addMovie = import('../views/adminMovie/addMovie.vue')
const order = import('../views/order/setOrder.vue')
const orderShow = import('../views/order/payOrder.vue')
const addHall = import('../views/adminHall/addHall.vue')
const addTheater = import('@/views/adminTheater/addTheater.vue')
const admin = import('@/views/admin/index.vue')
const showHall = import('@/views/adminHall/showHall.vue')
const viewHall = import('@/views/adminHall/viewHall.vue')
const showSession = import('@/views/adminSession/showSession.vue')
const addSession = import('@/views/adminSession/addSession.vue')
const viewSession = import('@/views/adminSession/viewSession.vue')
const movieSession = import('@/views/movieDetail/movieSession.vue')
const viewMovie = import('@/views/adminMovie/viewMovie.vue')
const showMovie = import('@/views/adminMovie/showMovie.vue')
const notFound = import('@/views/notFound/index.vue')

import { useUserStore } from '@/stores/index'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/index' },
    { path: '/index', component: index, name: 'index' },
    { path: '/login', name: 'login', component: login },
    { path: '/user', name: 'user', component: user },
    { path: '/movie', name: 'movie', component: movie },
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      redirect: '/admin/showHall',
      children: [
        { path: '/admin/showHall', name: 'showHall', component: showHall },
        { path: '/admin/viewHall/:id', name: 'viewHall', component: viewHall },
        { path: '/admin/addHall', name: 'addHall', component: addHall },
        { path: '/admin/showSession', name: 'showSession', component: showSession },
        { path: '/admin/viewSession/:id', name: 'viewSession', component: viewSession },
        { path: '/admin/addSession', name: 'addSession', component: addSession },
        { path: '/admin/addMovie', name: 'addMovie', component: addMovie },
        { path: '/admin/showMovie', name: 'showMovie', component: showMovie },
        { path: '/admin/viewMovie/:id', name: 'viewMovie', component: viewMovie },
        { path: '/admin/addTheater', name: 'addTheater', component: addTheater }
      ]
    },
    { path: '/orderShow', name: 'orderShow', component: orderShow },
    { path: '/order/:session_id', name: 'order', component: order },
    {
      path: '/movieDetail/:id',
      name: 'movieDetail',
      component: movieDetail,
      children: [
        {
          path: '/movieDetail/:id/introduction',
          name: 'movieDetailIntro',
          component: movieDetailIntro
        },
        {
          path: '/movieDetail/:id/performer',
          name: 'movieDetailPerformer',
          component: movieDetailPerformer
        },
        {
          path: '/movieDetail/:id/picture',
          name: 'movieDetailPicture',
          component: movieDetailPicture
        }
      ]
    },
    { path: '/movieSession/:id', name: 'movieSession', component: movieSession },
    { path: '/:pathMatch(.*)*', name: 'notFound', component: notFound }
  ]
})

const authUrls = [
  'user',
  'showHall',
  'viewHall',
  'addHall',
  'showSession',
  'viewSession',
  'addSession',
  'addTheater',
  'addMovie',
  'orderShow',
  'showMovie',
  'order'
]
const adminUrls = [
  'showHall',
  'viewHall',
  'addHall',
  'showSession',
  'viewSession',
  'addSession',
  'addTheater',
  'addMovie',
  'showMovie'
]

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  // 刷新后 store 可能为空，从 localStorage 补充 token
  const token = userStore.token || userStore.getlocalToken()
  const status = userStore.status

  if (adminUrls.includes(to.name)) {
    if (!(token && !status)) {
      ElMessage.error('权限不足，无法访问')
      // next(from.path || '/index')
      return
    }
  } else if (authUrls.includes(to.name)) {
    if (!token) {
      ElMessage.error('请先登录')
      next('/login')
      return
    }
  }
  next()
})

export default router
