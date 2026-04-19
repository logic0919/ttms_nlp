<script setup>
import { useUserStore } from '@/stores/index'
import { storeToRefs } from 'pinia'
import { onMounted, provide, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { orderReturnService, orderGetUserService } from '@/api/order'
import { useRouter } from 'vue-router'
import { formatTime } from '@/utils/data'

const userStore = useUserStore()
const { id, status } = storeToRefs(userStore)
const router = useRouter()

const isInfo = ref(true)
const switchInfo = () => {
  isInfo.value = true
}
const switchOrder = () => {
  isInfo.value = false
  if (order_list.value.length === 0) fetchOrders()
}

const order_list = ref([])

const parseSeatPositions = (seatPositions) => {
  if (!seatPositions) return []
  return seatPositions.split(',').map((pos) => {
    const [r, c] = pos.split('-').map(Number)
    return [r, c]
  })
}

const getOrderType = (item) => {
  if (item.status === 0) return 3

  const isPaid = item.exp && item.exp.startsWith('3000')

  if (!isPaid) {
    const expTime = new Date(item.exp?.replace(' ', 'T') || 0).getTime()
    if (expTime > Date.now()) return 1
    return 5
  }

  const showTime = new Date(item.stime).getTime()
  if (showTime > Date.now()) return 2
  return 4
}

const fetchOrders = async () => {
  try {
    const res = await orderGetUserService()
    if (res.data.success) {
      const orders = res.data.data.orders || []
      order_list.value = orders.map((item) => ({
        id: item.order_id,
        movie: item.movie_name,
        show_time: item.stime ? formatTime(item.stime) : '',
        stime: item.stime,
        hall: item.hall_name,
        price: item.price,
        seat: parseSeatPositions(item.seat_positions),
        movie_img: item.movie_img || '',
        theater: '',
        status: item.status,
        exp: item.exp,
        type: getOrderType(item)
      }))
    } else {
      ElMessage.error('订单获取失败')
    }
  } catch (e) {
    ElMessage.error('订单获取失败')
  }
}

onMounted(() => {})

provide('backMoney', async (orderId) => {
  ElMessageBox.confirm('确定退款吗？', '提示')
    .then(async () => {
      try {
        const res = await orderReturnService(orderId)
        if (res.data.success) {
          const target = order_list.value.find((o) => o.id === orderId)
          if (target) target.type = 3
          ElMessage({ message: '退款成功', type: 'success' })
        } else {
          ElMessage({ message: '退款失败', type: 'error' })
        }
      } catch (e) {
        ElMessage({ message: '退款失败', type: 'error' })
      }
    })
    .catch(() => {})
})

const loginout = () => {
  ElMessageBox.confirm('确定退出登录吗？', '提示')
    .then(() => {
      userStore.clearAll()
      ElMessage.success('退出成功')
      router.push('/login')
    })
    .catch(() => {})
}

// status==0 是管理员，1 是普通用户
const statusLabel = (s) => {
  if (!s) return '管理员'
  return '普通用户'
}
</script>

<template>
  <div class="user">
    <div class="left">
      <div class="info">
        <el-avatar
          v-if="!status"
          src="https://ttms-img.oss-cn-beijing.aliyuncs.com/assets/admin.png"
          class="avatar"
          :size="50"
        />
        <el-avatar
          v-else
          src="https://ttms-img.oss-cn-beijing.aliyuncs.com/assets/user.png"
          class="avatar"
          :size="50"
        />
        <div class="id">id：{{ id }}</div>
        <div class="name">身份：{{ statusLabel(status) }}</div>
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
            <h5 class="sortName">用户id：</h5>
            {{ id }}
          </li>
          <li>
            <h5 class="sortName">身份：</h5>
            {{ statusLabel(status) }}
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
          :hall="i.hall"
          :img="i.movie_img"
          :seat="i.seat.map((subArr) => `${subArr[0]}行${subArr[1]}列`)"
          :price="i.price"
          :type="i.type"
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
    .nav li {
      width: 90%;
      height: 40px;
      margin: 20px auto;
      background-color: rgb(157, 204, 235);
      line-height: 40px;
      padding-left: 15px;
      padding-right: 15px;
      border-radius: 6px;
      color: rgb(255, 255, 255);
      cursor: pointer;
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
        height: 300px;
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
