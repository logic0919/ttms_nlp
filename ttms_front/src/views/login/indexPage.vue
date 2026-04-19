<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { userRegisterService, userLoginService } from '@/api/user'
import { useUserStore } from '@/stores/index'

const router = useRouter()
const userStore = useUserStore()
const { setAll, setlocalToken, setlocalId } = userStore

const pwdinp1 = ref(null)
const pwdinp2 = ref(null)
const pwdinp3 = ref(null)
const islogin = ref(true)

// 登录和注册用独立的 form ref，避免切换后 ref 失效
const loginForm = ref(null)
const registerForm = ref(null)

const loginModel = ref({ id: '' })
const registerModel = ref({ id: '' })

// 账号格式：只允许数字、英文字母、下划线，长度4-20
const idValidator = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入用户ID'))
  } else if (!/^[a-zA-Z0-9_]{4,20}$/.test(value)) {
    callback(new Error('只能包含字母、数字、下划线，长度4-20位'))
  } else {
    callback()
  }
}

const rules = {
  id: [{ validator: idValidator, trigger: 'blur' }]
}

const switchLogin = () => {
  islogin.value = true
  loginModel.value.id = ''
  registerModel.value.id = ''
}
const switchRegister = () => {
  islogin.value = false
  loginModel.value.id = ''
  registerModel.value.id = ''
}

const loginClass = computed(() =>
  islogin.value ? ['active span'] : ['noactive span']
)
const registerClass = computed(() =>
  islogin.value ? ['noactive span'] : ['active span']
)

const register = async () => {
  await registerForm.value.validate()
  await pwdinp2.value.validate()
  await pwdinp3.value.validate()
  if (pwdinp2.value.formModel.pwd !== pwdinp3.value.formModel.pwd) {
    ElMessage({ message: '两次密码不一致', type: 'error' })
    return
  }
  const res = await userRegisterService({
    id: registerModel.value.id,
    pwd: pwdinp2.value.formModel.pwd
  })
  if (res.data.success) {
    ElMessage({ message: '注册成功，请登录', type: 'success' })
    switchLogin()
  }
}

const login = async () => {
  await loginForm.value.validate()
  await pwdinp1.value.validate()
  const res = await userLoginService({
    user_id: loginModel.value.id,
    pwd: pwdinp1.value.formModel.pwd
  })
  if (res.data.success) {
    const innerData = res.data.data.data
    const token = innerData.token
    const user_id = innerData.user_id
    const status = innerData.status
    setlocalToken(token)
    setlocalId(user_id)
    setAll({ token, id: user_id, status })
    ElMessage({ message: '登录成功', type: 'success' })
    setTimeout(() => router.push('/index'), 1000)
  }
}
</script>

<template>
  <div class="main">
    <div class="left">
      <img src="../../assets/image/index02.jpg" alt="" />
    </div>
    <div class="right">
      <div class="form">
        <div class="formMain">
          <div class="logo">
            <img src="/src/assets/image/logo.jpg" alt="" />
          </div>
          <div class="nav">
            <span @click="switchLogin" :class="loginClass">登录</span>
            <span @click="switchRegister" :class="registerClass">注册</span>
          </div>

          <div class="register" v-if="!islogin">
            <el-form
              class="elform"
              :model="registerModel"
              :rules="rules"
              ref="registerForm"
            >
              <el-form-item prop="id" class="elinput">
                <el-input
                  v-model="registerModel.id"
                  placeholder="请输入用户ID"
                ></el-input>
              </el-form-item>
            </el-form>
            <pwd-input ref="pwdinp2"></pwd-input>
            <pwd-input ref="pwdinp3"></pwd-input>
            <button @click="register">注册</button>
          </div>

          <div class="login" v-if="islogin">
            <el-form
              class="elform"
              :model="loginModel"
              :rules="rules"
              ref="loginForm"
            >
              <el-form-item prop="id" class="elinput">
                <el-input
                  v-model="loginModel.id"
                  placeholder="请输入用户ID"
                ></el-input>
              </el-form-item>
            </el-form>
            <pwd-input ref="pwdinp1"></pwd-input>
            <button class="btn" @click="login">登录</button>
          </div>

          <h6 class="agree">
            注册登录即表示同意 <i>用户协议</i> 和 <i>隐私政策</i>
          </h6>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  height: 88vh;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  background-color: rgb(243, 243, 243);
  .left {
    width: 60%;
    min-width: 600px;
    border-top-right-radius: 40px;
    border-bottom-right-radius: 40px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right {
    width: 40%;
    min-width: 430px;
    .form {
      width: 70%;
      height: 70vh;
      margin: 0 auto;
      margin-top: 6vh;
      background-color: rgb(255, 255, 255);
      box-shadow: 5px 6px 10px 4px rgb(222, 222, 222);
      padding-top: 50px;
      border-radius: 10px;
      .formMain {
        width: 70%;
        height: 400px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        margin: 0 auto;
        .logo {
          height: 50px;
          line-height: 200%;
          img {
            width: 50%;
          }
        }
        .nav {
          height: 40px;
          .active {
            color: rgb(33, 90, 229);
            border-bottom: 2px solid rgb(33, 90, 229);
          }
          .noactive {
            color: rgb(138, 138, 138);
            border-bottom: 2px solid rgb(138, 138, 138);
          }
          .span {
            cursor: pointer;
            display: inline-block;
            width: 36%;
            height: 40px;
            font-size: 15px;
            line-height: 35px;
            &:nth-child(1) {
              margin-right: 10px;
            }
          }
        }
        .login {
          height: 180px;
          .btn {
            font-size: 17px;
            font-weight: 700;
            letter-spacing: 5px;
          }
        }
        .login,
        .register {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          & > input {
            width: 100%;
          }
          button {
            width: 80%;
            margin: 0 auto;
            height: 40px;
            background-color: rgb(33, 90, 229);
            color: rgb(255, 255, 255);
            border-color: transparent;
            border-radius: 3px;
          }
        }
        .agree {
          text-align: center;
          i {
            color: rgb(33, 90, 229);
          }
        }
      }
    }
  }
}
</style>
