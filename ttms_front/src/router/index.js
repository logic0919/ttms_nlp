import { createRouter, createWebHistory } from 'vue-router'
// 首页相关
import index from '@/views/index/index.vue'
import movie from '../views/movie/index.vue'
import user from '../views/user/index.vue'
// 非首页相关

const login = import('../views/login/indexPage.vue')
const register = import('../views/login/register.vue')
const movieDetail = import('../views/movieDetail/index.vue')
const movieDetailIntro = import('../views/movieDetail/movieDetailIntro.vue')
const movieDetailPerformer = import(
  '../views/movieDetail/movieDetailPerformer.vue'
)
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
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: index,
      name: 'index'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register/:token',
      name: 'register',
      component: register
    },
    {
      path: '/user',
      name: 'user',
      component: user
    },
    {
      path: '/movie',
      name: 'movie',
      component: movie
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      redirect: '/admin/showHall/1',
      children: [
        // 关于影厅管理
        {
          path: '/admin/showHall/:id',
          name: 'showHall',
          component: showHall
        },
        {
          path: '/admin/viewHall/:theater_id/:id',
          name: 'viewHall',
          component: viewHall
        },
        {
          path: '/admin/addHall/:theater_id',
          name: 'addHall',
          component: addHall
        },
        // 关于场次管理
        {
          path: '/admin/showSession/:theater_id',
          name: 'showSession',
          component: showSession
        },
        {
          path: '/admin/viewSession/:theater_id/:id',
          name: 'viewSession',
          component: viewSession
        },
        {
          path: '/admin/addSession/:theater_id',
          name: 'addSession',
          component: addSession
        },
        // 关于影片管理
        {
          path: '/admin/addMovie',
          name: 'addMovie',
          component: addMovie
        },
        {
          path: '/admin/showMovie',
          name: 'showMovie',
          component: showMovie
        },
        {
          path: '/admin/viewMovie/:id',
          name: 'viewMovie',
          component: viewMovie
        },
        // 关于影院管理
        {
          path: '/admin/addTheater',
          name: 'addTheater',
          component: addTheater
        }
      ]
    },
    {
      path: '/orderShow',
      name: 'orderShow',
      component: orderShow
    },
    {
      path: '/order/:session_id',
      name: 'order',
      component: order
    },
    {
      path: '/movieDetail/:id',
      name: 'movieDetail',
      component: movieDetail,
      children: [
        // 电影简介
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
    {
      path: '/movieSession/:id',
      name: 'movieSession',
      component: movieSession
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: notFound
    }
  ]
})
// 登录禁止权限页面路径数组
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
  'showMovie'
]
// 管理员禁止权限页面
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
  const token = userStore.token
  const status = userStore.status
  //   管理员要求页面
  if (adminUrls.includes(to.name)) {
    console.log('进入管理页面')
    // 登录并且身份是管理员
    if (!(token && status === 'administrator')) {
      ElMessage.error('权限不足，无法访问')
      return
    }
  }
  // 登录要求页面
  else if (authUrls.includes(to.name)) {
    console.log('进入登录限制页面')
    if (!token) {
      ElMessage.error('请先登录')
      next('/login')
      return
    }
  }
  next()
})

export default router
