<script setup>
import { useUserStore } from '@/stores/index'
import { userGetInfoService } from '@/api/user'
const userStore = useUserStore()
const {
  setAll,
  setToken,
  setlocalTime,
  getlocalTime,
  clearAll,
  setlocalToken,
  getlocalToken
} = userStore
const autoLogin = async () => {
  const nowtime = new Date().getTime() + ''
  const expiretime = getlocalTime()
  // 有本地缓存的情况
  if (expiretime) {
    // 过期情况，删token，其他信息，时间戳
    if (nowtime < expiretime) {
      clearAll()
      console.log('过期')
    } else {
      // 没有过期情况：更新时间戳，从本地取数据放到仓库中
      setlocalTime()
      setlocalToken(getlocalToken())
      setToken(getlocalToken())
      console.log('自动登录')
      const res = await userGetInfoService()
      if (res.data.status === 200) {
        const data = res.data.data
        setAll({ ...data, name: data.nick_name, token: getlocalToken() })
      } else {
        ElMessage.error('用户信息获取失败')
      }
    }
  }
}
autoLogin()
</script>

<template>
  <top-nav></top-nav>
  <router-view style="margin-top: 90px"></router-view>
</template>

<style lang="scss" scoped></style>
