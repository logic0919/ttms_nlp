<script setup>
import { Document, VideoCamera, Film } from '@element-plus/icons-vue'
</script>

<template>
  <div class="mainmain">
    <div class="admin">
      <div class="menu">
        <el-menu
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          router
          default-active="/admin/showHall"
        >
          <el-menu-item index="/admin/showHall">
            <template #title>
              <el-icon><VideoCamera /></el-icon>
              <span>影厅管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/admin/showSession">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>场次管理</span>
            </template>
          </el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><Film /></el-icon>
              <span>影片管理</span>
            </template>
            <el-menu-item index="/admin/showMovie">影片库</el-menu-item>
            <el-menu-item index="/admin/addMovie">添加影片</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <div class="main"><router-view></router-view></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin {
  width: 99%;
  min-width: 700px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  .menu {
    width: 220px;
  }
  .main {
    width: 100%;
  }
}
</style>

