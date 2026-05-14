<script setup>
import { onMounted } from 'vue'
// 确保安装了图标库：npm install @element-plus/icons-vue
import { Document, VideoCamera, Film } from '@element-plus/icons-vue'

const initCozeSDK = () => {
  if (typeof window.CozeWebSDK !== 'undefined') {
    try {
      new window.CozeWebSDK.WebChatClient({
        config: {
          type: 'bot',
          bot_id: '7619678615225204777' // 你的 Bot ID
        },
        auth: {
          type: 'token',
          token:
            'pat_tqAHUE9hiZXG9y4o90sIIxaAvnDovwBp0rQ1DV8h8W9mUx7uC6D7lHJCpYB3FC8x', // 必须填入真实的 PAT
          // 这里必须写在 auth 里面！
          onRefreshToken: async () => {
            console.log('Token 正在刷新...')
            return 'pat_tqAHUE9hiZXG9y4o90sIIxaAvnDovwBp0rQ1DV8h8W9mUx7uC6D7lHJCpYB3FC8x'
          }
        },
        ui: {
          base: {
            lang: 'zh-CN',
            zIndex: 10000
          },
          asstBtn: {
            isNeed: true
          },
          chatBot: {
            title: '智能电影助手',
            width: 390
          }
        }
      })
      console.log('Coze 智能体初始化逻辑执行完毕')
    } catch (e) {
      console.error('Coze SDK 内部报错:', e)
    }
  }
}

onMounted(() => {
  if (window.CozeWebSDK) {
    initCozeSDK()
    return
  }

  const script = document.createElement('script')
  // 修正后的 coze.cn 链接
  script.src =
    'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.20/libs/cn/index.js'
  script.async = true
  script.onload = () => initCozeSDK()
  script.onerror = () => console.eror('SDK 加载失败，检查网络')
  document.head.appendChild(script)
})
</script>

<template>
  <div class="mainmain">
    <div class="admin">
      <div class="menu">
        <el-menu
          class="el-menu-vertical-demo"
          router
          default-active="/admin/showHall"
        >
          <el-menu-item index="/admin/showHall">
            <!-- 修改这里：确保图标能显示 -->
            <el-icon><component :is="VideoCamera" /></el-icon>
            <span>影厅管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/showSession">
            <el-icon><component :is="Document" /></el-icon>
            <span>场次管理</span>
          </el-menu-item>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><component :is="Film" /></el-icon>
              <span>影片管理</span>
            </template>
            <el-menu-item index="/admin/showMovie">影片库</el-menu-item>
            <el-menu-item index="/admin/addMovie">添加影片</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <div class="main">
        <router-view></router-view>
      </div>
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
