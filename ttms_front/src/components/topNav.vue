<script setup>
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const { token, id, status } = storeToRefs(userStore)

</script>

<template>
  <div class="topNav">
    <div class="main">
      <div class="left">
        <img src="../assets/image/logo.jpg" alt="" class="logo" />
        <el-button type="danger" plain @click="router.push('/index')" class="a">首页</el-button>
        <el-button type="danger" plain @click="router.push('/movie')" class="b">电影</el-button>
        <el-button
          type="danger"
          plain
          v-if="!status"
          @click="router.push('/admin')"
          class="b"
        >管理端</el-button>
      </div>
      <div class="right1">
        <el-button
          class="btn"
          v-if="!token"
          @click="router.push('/login')"
          type="danger"
          plain
        >登录</el-button>
        <div class="show" v-else>
          <div class="name">{{ id }}</div>
          <el-button
            type="danger"
            plain
            style="margin-left: 10px"
            @click="router.push('/user')"
            class="b"
          >个人中心</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  list-style: none;
  text-decoration: none;
}
.topNav {
  position: fixed;
  top: 0;
  z-index: 11;
  width: 100%;
  min-width: 1000px;
  height: 90px;
  background-color: rgb(255, 255, 255);
  border-bottom: 1px solid rgb(201, 201, 201);
  margin-bottom: 20px;
  .main {
    width: 84%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      .logo { width: 230px; height: 100%; }
      .a, .b { width: 80px; height: 50px; margin-left: 20px; }
    }
    .right1 {
      width: 200px;
      .btn { width: 60px; height: 30px; background-color: rgb(255, 255, 255); border-radius: 6px; }
      .show {
        display: flex;
        align-items: center;
        .name { font-size: 17px; }
      }
    }
  }
}
</style>