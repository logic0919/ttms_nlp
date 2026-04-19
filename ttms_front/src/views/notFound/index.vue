<script setup></script>

<template>
  <div class="notFound">
    <h1>404</h1>
    <p>页面跑到月球上去了</p>
    <router-link to="/index">返回首页</router-link>
  </div>
</template>

<style scoped>
.notFound {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 20px;
}
.notFound h1 {
  font-size: 80px;
  color: #ccc;
}
.notFound p {
  font-size: 22px;
  color: #888;
}
.notFound a {
  color: #409eff;
  text-decoration: none;
  font-size: 16px;
}
</style>