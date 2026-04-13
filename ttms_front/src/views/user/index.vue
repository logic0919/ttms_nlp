<script setup>
import { useUserStore } from '@/stores/index'
import {
  userUpdateService,
  userUpdateAvatarService,
  userGetMoneyService,
  userGetOrdersService
} from '@/api/user'
import { userRechargeService } from '@/api/user'
// import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { onMounted, provide, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { orderReturnService } from '@/api/order'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const { id, name, avatar, email } = storeToRefs(userStore)
const isInfo = ref('')
isInfo.value = true
// isInfo.value = false
// 关于修改信息
const form = ref(null)
const router = useRouter()
const formModel = ref({
  name: ''
})
const rules = {
  name: [
    // { required: true, message: '请输入昵称', trigger: 'blur' },
    // {
    //   pattern: /^\d{11}$/,
    //   message: '邮箱必须11位数字',
    //   trigger: 'blur'
    // }
  ]
}
// 修改昵称开关
const isNameChange = ref(false)
const switchChangeName = () => {
  isNameChange.value = !isNameChange.value
}
// 修改昵称函数
const userUpdate = async () => {
  const name = formModel.value.name
  if (!name) {
    switchChangeName()
    return
  }
  await form.value.validate()
  const res = await userUpdateService(name)
  if (res.data.status === 200) {
    userStore.setName(name)
    isNameChange.value = !isNameChange.value
    console.log(userStore.name)
  }
}
// 修改头像开关
const isAvatarChange = ref(false)
const switchChangeAvatar = () => {
  isAvatarChange.value = !isAvatarChange.value
}
const file = ref('')
// 选择文件
const handleFileUpload = (event) => {
  file.value = event.target.files[0]
}
// 上传文件
const submitFile = async () => {
  const formData = new FormData()
  formData.append('file', file.value)
  const res = await userUpdateAvatarService(formData.get('file'))
  if (res.status === 200) {
    userStore.setAvatar(res.data.data.avatar)
    ElMessage.success('上传成功')
    switchChangeAvatar()
  } else {
    ElMessage.error('上传失败')
  }
}
const isRecharge = ref(false)
const switchInfo = () => {
  isInfo.value = true
}
const switchOrder = () => {
  isInfo.value = false
}
const money = ref(0)
const recharge = async () => {
  const res = await userRechargeService(Number(count.value))
  if (res.status === 200) {
    money.value += Number(count.value)
    isRecharge.value = false
    ElMessage.success('充值成功')
    count.value = ''
  } else {
    ElMessage.error('操作失败')
  }
}
const order_list = ref([])
const count = ref('')
onMounted(async () => {
  const res = await userGetMoneyService()
  console.log(res.data.data)
  if (res.data.status === 200) {
    money.value = res.data.data.money
  } else {
    ElMessage.error('余额获取失败')
  }
  const res1 = await userGetOrdersService()
  console.log(res1.data.data)
  if (res1.data.status === 200) {
    if (res1.data.data === null) {
      order_list.value = []
    } else {
      order_list.value = res1.data.data
    }
  } else {
    ElMessage.error('订单获取失败')
  }
})
provide('backMoney', async (id) => {
  ElMessageBox.confirm('确定退款吗？', '提示')
    .then(async () => {
      const res = await orderReturnService(id)
      if (res.data.status === 200) {
        for (let i = 0; i < order_list.value.length; i++) {
          if (order_list.value[i].id === id) {
            order_list.value[i].type = 3
            break
          }
        }
        ElMessage({ message: '退款成功', type: 'success' })
      } else {
        ElMessage({ message: '退款失败', type: 'error' })
      }
    })
    .catch(() => {})
})
const cancle = () => {
  isRecharge.value = false
  count.value = ''
}
const loginout = () => {
  ElMessageBox.confirm('确定退出登录吗？', '提示')
    .then(async () => {
      userStore.clearAll()
      userStore.setAll({
        id: '',
        name: '',
        avatar: '',
        email: '',
        token: '',
        status: ''
      })
      ElMessage.success('退出成功')
      router.push('/login')
    })
    .catch(() => {})
}
</script>

<template>
  <!-- <top-nav></top-nav> -->
  <div class="user">
    <div class="left">
      <div class="info">
        <el-avatar class="avatar" :size="50" :src="avatar" />
        <div class="id">id：{{ id }}</div>
        <div class="name">昵称：{{ name }}</div>
      </div>
      <div class="line"></div>
      <div class="nav">
        <ul>
          <li @click="switchInfo">个人信息</li>
          <li @click="switchOrder">我的订单</li>
        </ul>
      </div>
    </div>
    <div class="right">
      <div class="info1" v-show="isInfo">
        <div class="navName">个人信息</div>
        <div class="line"></div>
        <ul class="infoShow">
          <li>
            <h5 class="sortName">用户头像：</h5>
            <div class="avatarShow" v-if="!isAvatarChange">
              <div class="avatar"><el-avatar :size="50" :src="avatar" /></div>
              <el-button
                class="btn"
                type="primary"
                @click="switchChangeAvatar"
                plain
                >修改头像</el-button
              >
            </div>
            <div class="avatarChange" v-else>
              <input type="file" @change="handleFileUpload" />
              <button @click="submitFile">上传</button>
            </div>
          </li>
          <li>
            <h5 class="sortName">用户id：</h5>
            {{ id }}
          </li>
          <li>
            <h5 class="sortName">昵称：</h5>
            <div class="nameShow" v-if="!isNameChange">
              <div class="name">{{ name }}</div>
              <el-button
                class="btn"
                type="primary"
                @click="switchChangeName"
                plain
                >修改昵称</el-button
              >
            </div>
            <div class="nameChange" v-else>
              <el-form
                class="elform"
                :model="formModel"
                :rules="rules"
                ref="form"
              >
                <el-form-item prop="name" class="elinput">
                  <el-input
                    v-model="formModel.name"
                    placeholder="请输入昵称"
                  ></el-input>
                </el-form-item>
              </el-form>
              <el-button class="btn" type="primary" @click="userUpdate" plain
                >提交修改</el-button
              >
              <el-button
                class="btn"
                type="primary"
                @click="switchChangeName"
                plain
                >取消</el-button
              >
            </div>
          </li>
          <li>
            <h5 class="sortName">邮箱：</h5>
            {{ email }}
          </li>
          <li>
            <h5 class="sortName">我的余额：</h5>
            <div v-if="!isRecharge" class="recharge">
              <h2 style="margin-right: 20px">{{ money }}</h2>
              <el-button type="primary" @click="isRecharge = true"
                >充值</el-button
              >
            </div>
            <div v-else>
              <el-input
                v-model="count"
                style="width: 260px"
                placeholder="请输入要充值的数目"
                class="input-with-select"
              >
                <template #append> <div @click="recharge">充值</div> </template>
              </el-input>
              <el-button
                plain
                @click="cancle()"
                type="primary"
                style="margin-left: 30px"
                >取消</el-button
              >
            </div>
          </li>
          <li>
            <h5 class="sortName">退出登录：</h5>
            <el-button type="primary" @click="loginout">退出登录</el-button>
          </li>
        </ul>
      </div>
      <div class="orders" v-show="!isInfo">
        <div v-if="order_list.length === 0">
          <el-empty
            style="margin-top: 100px"
            description="还没有订单"
          ></el-empty>
        </div>
        <div class="order" v-else>我的订单</div>
        <myOrder
          v-for="i in order_list"
          :key="i.id"
          :id="i.id"
          :date="i.show_time"
          :name="i.movie"
          :theater="i.theater"
          :img="i.movie_img"
          :seat="i.seat.map((subArr) => `${subArr[0]}行${subArr[1]}列`)"
          :price="i.money"
          :status="i.type"
          :hall="i.hall"
        ></myOrder>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  list-style: none;
}
.user {
  display: flex;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 30px;
  .left {
    width: 14vw;
    min-width: 160px;
    height: 94vh;
    border-radius: 10px;
    background-color: rgb(195, 242, 242);
    padding-top: 30px;
    margin-top: 10px;
    .info {
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      // background-color: antiquewhite;
      .avatar {
        width: 120px;
        height: 120px;
        transition: all 0.5s;
      }
      .avatar:hover {
        width: 140px;
        height: 140px;
      }
      .id,
      .name {
        color: rgb(98, 98, 98);
        font-size: 16px;
      }
    }
    .line {
      width: 95%;
      height: 2px;
      background-color: rgb(155, 155, 155);
      margin: 0 auto;
      border-radius: 2px;
    }
    .nav {
      li {
        width: 90%;
        height: 40px;
        margin: 20px auto;
        background-color: rgb(157, 204, 235);
        line-height: 40px;
        padding-left: 15px;
        padding-right: 15px;
        border-radius: 6px;
        color: rgb(255, 255, 255);
      }
    }
  }
  .right {
    margin-top: 10px;
    width: 80vw;
    height: 94vh;
    border-radius: 10px;
    min-width: 760px;
    padding: 40px;
    background-color: rgb(240, 240, 240);
    .info1 {
      .navName {
        height: 30px;
        margin-bottom: 10px;
      }
      .line {
        width: 100%;
        height: 2px;
        background-color: rgb(155, 155, 155);
        margin: 0 auto;
        border-radius: 2px;
      }
      .infoShow {
        height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        li {
          height: 90px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          border-bottom: 1px dashed rgb(158, 158, 158);
          .sortName {
            width: 100px;
            margin-right: 20px;
            font-size: 17px;
          }
          .recharge {
            display: flex;
          }
          .avatarShow,
          .avatarChange {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .btn {
              margin-left: 20px;
            }
          }
          .nameShow,
          .nameChange {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .btn {
              margin-left: 20px;
            }
          }
        }
      }
    }
    .orders {
      .order {
        color: rgb(255, 100, 100);
        border-bottom: 1px solid rgb(156, 156, 156);
        height: 40px;
        padding-left: 15px;
        font-size: 22px;
        letter-spacing: 5px;
      }
    }
  }
}
</style>
