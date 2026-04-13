<script setup>
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const token = route.params.token
import { userVerifyEmailService } from '@/api/user'
import { onMounted } from 'vue'
let loadingInstance
// 进入页面就发验证请求
onMounted(() => {
  loadingInstance = ElLoading.service({ fullscreen: true, text: '请求中···' })
  verify()
})
const verify = async () => {
  console.log(token)
  const res = await userVerifyEmailService(token)
  loadingInstance.close()
  console.log(res)
  if (res && res.data.status == 200) {
    ElMessageBox.alert(
      `注册成功，请记住您的id为：${res.data.data.id}`,
      '提示',
      '确认'
    )
      .then(() => {
        router.push('/login')
      })
      .catch(() => {
        // catch error
      })
  } else {
    ElMessageBox.alert('身份验证失败，点击确认跳转至注册页面', '提示', '确认')
      .then(() => {
        router.push('/login')
      })
      .catch(() => {
        // catch error
      })
  }
}
</script>
<template>
  <div class="register"></div>
</template>

<style lang="scss" scoped>
// .register {
//     width: 100vw;
//     height: 100vh;
//     background-color: rgb(255, 255, 255);
//     padding-top: 60px;
//     .registerMain {
//     width: 400px;
//     height: 400px;
//     background-color: rgb(243, 243, 243);
//     box-shadow: 6px 6px 10px 4px rgb(178, 178, 178);
//     border-radius: 10px;
//     margin: 0 auto;
//     padding-top: 50px;
//     padding-left: 20px;
//     padding-right: 20px;
//     h4 {
//         height: 30%;
//     }
//     .main {
//         width: 100%;
//         height: 60%;
//         display: flex;
//         flex-direction: column;
//         justify-content: space-around;
//         background-color: rgb(243, 243, 243);
//         .btn {
//             width: 80%;
//             margin: 0 auto;
//         }
//     }
//     em {
//         color: rgb(31, 86, 182);
//     }
// }
// }
</style>
