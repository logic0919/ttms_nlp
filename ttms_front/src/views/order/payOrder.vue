<script setup>
import { useRoute, useRouter } from 'vue-router'
import { orderConfirmService, orderPayService } from '@/api/order'
import { ref, onMounted, watch } from 'vue'
import { formatTime } from '@/utils/data'

const route = useRoute()
const router = useRouter()
const orderId = route.query.orderId

const info = ref({
  movie: '',
  seats: [],
  money: '',
  hall: '',
  show_time: '',
  surplus_time: 0,
  status: null,
  exp: ''
})

const min = ref(0)
const second = ref(0)
let timer = null

const startCountdown = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (info.value.surplus_time <= 0) {
      clearInterval(timer)
      timer = null
    } else {
      info.value.surplus_time--
    }
  }, 1000)
}

watch(
  () => info.value.surplus_time,
  (newVal) => {
    min.value = Math.floor(newVal / 60)
    second.value = newVal % 60
  },
  { immediate: true }
)

// 判断订单是否已支付（exp 为 3000-01-01 则为已支付）
const isPaid = ref(false)
// 判断倒计时是否已过期（surplus_time <= 0）
const isExpired = ref(false)

onMounted(async () => {
  if (!orderId) {
    ElMessage.error('订单ID不存在')
    router.push('/user')
    return
  }
  try {
    const res = await orderConfirmService(Number(orderId))
    if (res.data.success) {
      const data = res.data.data
      info.value.movie = data.movie_name
      info.value.seats = data.seats || []
      info.value.money = data.order_price
      info.value.hall = data.hall_name
      info.value.show_time = formatTime(data.session_start_time)
      info.value.status = data.status
      info.value.exp = data.exp

      // 判断是否已支付
      if (data.exp && data.exp.startsWith('3000')) {
        isPaid.value = true
        info.value.surplus_time = 0
      } else {
        // 计算剩余时间
        const expTime = new Date(data.exp.replace(' ', 'T')).getTime()
        const remaining = Math.floor((expTime - Date.now()) / 1000)
        info.value.surplus_time = remaining > 0 ? remaining : 0
        if (remaining <= 0) {
          isExpired.value = true
        } else {
          startCountdown()
        }
      }
    } else {
      ElMessage.error('订单信息获取失败')
    }
  } catch (e) {
    ElMessage.error('订单信息获取失败')
  }
})

const pay = async () => {
  if (info.value.surplus_time <= 0 && !isPaid.value) {
    ElMessage.error('订单已过期，无法支付')
    return
  }
  try {
    const res = await orderPayService(Number(orderId))
    if (res.data.success) {
      isPaid.value = true
      info.value.surplus_time = 0
      clearInterval(timer)
      timer = null
      ElMessage.success('支付成功')
    } else {
      ElMessage.error('支付失败，请稍后重试')
    }
  } catch (e) {
    // 错误由拦截器处理
  }
}
</script>

<template>
  <div class="orderShow">
    <div class="countdown" v-if="!isPaid && !isExpired">
      <img style="margin-right: 10px; width: 30px" src="../../assets/image/countdown.png" alt="" />
      请在<span>{{ min }}分{{ second }}秒</span>内支付订单
    </div>
    <div class="countdown paid" v-else-if="isPaid">
      <span style="color: green; font-size: 22px">✓ 订单已支付成功</span>
    </div>
    <div class="countdown expired" v-else>
      <span style="color: #999; font-size: 22px">订单已过期</span>
    </div>

    <div class="show">
      <div class="nav">
        <div class="nav-item">影片</div>
        <div class="nav-item">时间</div>
        <div class="nav-item">影厅</div>
        <div class="nav-item">座位</div>
        <div class="nav-item">应付</div>
        <div class="nav-item">操作</div>
      </div>
      <div class="info">
        <div class="info-item name">{{ info.movie }}</div>
        <div class="info-item">{{ info.show_time }}</div>
        <div class="info-item">{{ info.hall }}</div>
        <div class="info-item">
          <div class="seatGro">
            <div class="seat" v-for="(s, idx) in info.seats" :key="idx">
              {{ s[0] }}行{{ s[1] }}列
            </div>
          </div>
        </div>
        <div class="info-item">{{ info.money }}</div>
        <div class="info-item">
          <button
            class="btn"
            :disabled="isPaid || isExpired || info.surplus_time <= 0"
            @click="pay"
          >
            {{ isPaid ? '已支付' : '支付订单' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.orderShow {
  width: 80%;
  margin: 0 auto;
  min-width: 700px;
  .countdown {
    height: 80px;
    background-color: rgb(247, 199, 199);
    margin-top: 80px;
    margin-bottom: 80px;
    font-size: 23px;
    display: flex;
    align-items: center;
    padding-left: 30px;
    span {
      color: red;
      font-style: italic;
      font-size: 29px;
      margin-left: 10px;
      margin-right: 10px;
    }
    &.paid { background-color: rgb(198, 247, 210); }
    &.expired { background-color: rgb(235, 235, 235); }
  }
  .show {
    height: 200px;
    .nav, .info {
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: space-between;
      background-color: rgb(167, 167, 167);
      .nav-item, .info-item {
        width: 15%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    }
    .nav .nav-item { color: white; font-size: 22px; }
    .info {
      background-color: rgb(235, 235, 235);
      .btn {
        width: 80px;
        margin: 0 auto;
        height: 40px;
        line-height: 40px;
        border-radius: 20px;
        border-color: transparent;
        background-color: red;
        color: white;
        cursor: pointer;
        &:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      }
      .name { font-size: 25px; font-weight: 600; color: red; }
    }
  }
}
</style>