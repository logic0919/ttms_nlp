<script setup>
import { useUserStore } from '@/stores/index'
import { userParseTokenService } from '@/api/user'

const userStore = useUserStore()

const autoLogin = async () => {
  const token = userStore.getlocalToken()
  if (!token) return
  // 先用本地存储恢复 store 状态（避免刷新后 store 丢失）
  try {
    const res = await userParseTokenService()
    if (res.data.success) {
      const data = res.data.data
      if (data.isexp) {
        userStore.clearAll()
        return
      }
      const new_token = data.data.token
      const new_id = data.data.user_id
      const new_status = data.data.status
      userStore.setlocalToken(new_token)
      userStore.setlocalId(new_id)
      userStore.setAll({
        token: new_token,
        id: new_id,
        status: new_status
      })
    } else {
      userStore.clearAll()
    }
  } catch (e) {
    userStore.clearAll()
  }
}
autoLogin()
</script>

<template>
  <top-nav></top-nav>
  <router-view style="margin-top: 90px"></router-view>
</template>

<style lang="scss" scoped></style>
