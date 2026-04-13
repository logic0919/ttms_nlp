<script setup>
import { useRoute } from 'vue-router'
import { orderConfirmService, orderPayService } from '@/api/order'
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
const route = useRoute()
const orderId = route.query.orderId
// const countdown = ref('')
const info = ref({
  movie: '',
  seat: '',
  money: '',
  theater: '',
  num: '',
  show_time: '',
  surplus_time: ''
})
const min = ref(0)
const second = ref(0)
let timer = setInterval(() => {
  if (info.value.surplus_time <= 0 || !info.value.surplus_time) {
    clearInterval(timer)
    timer = null
  } else {
    info.value.surplus_time--
  }
}, 1000)
watch(
  () => info.value.surplus_time,
  (newVal) => {
    min.value = Math.floor(newVal / 60)
    second.value = newVal % 60
  },
  { immediate: true }
)
onMounted(async () => {
  const res = await orderConfirmService(Number(orderId))
  if (res.data.status === 200) {
    const data = res.data.data
    console.log(data)
    info.value.movie = data.movie
    info.value.seat = data.seat.map((subArr) => `${subArr[0]}行${subArr[1]}列`)
    info.value.money = data.money
    info.value.theater = data.theater
    info.value.show_time = data.show_time
    info.value.hall = data.hall
    info.value.surplus_time = Math.floor(data.surplus_time)
  } else {
    ElMessage.error('订单信息获取失败')
  }
})
const pay = async () => {
  const res = await orderPayService(Number(orderId))
  if (res.data.status === 200) {
    const data = res.data.data
    console.log(data)
    ElMessage.success('支付成功')
  } else {
    ElMessage.error('支付订单失败，请稍后重试')
  }
}
</script>

<template>
  <div class="orderShow">
    <div class="countdown">
      <img
        style="margin-right: 10px; width: 30px"
        src="../../assets/image/countdown.png"
        alt=""
      />
      请在<span>{{ min }}分{{ second }}秒</span>内支付订单
    </div>
    <div class="show">
      <div class="nav">
        <div class="nav-item">影片</div>
        <div class="nav-item">时间</div>
        <div class="nav-item">影院</div>
        <div class="nav-item">座位</div>
        <div class="nav-item">应付</div>
        <div class="nav-item">操作</div>
      </div>
      <div class="info">
        <div class="info-item name">{{ info.movie }}</div>
        <div class="info-item">{{ info.show_time }}</div>
        <div class="info-item">{{ info.theater }}</div>
        <div class="info-item">{{ info.money }}</div>
        <div class="info-item">
          <div class="seatGro">
            <div class="seat" v-for="i in info.seat" :key="i">{{ i }}</div>
          </div>
        </div>
        <div class="info-item">
          <button class="info-item btn" :disabled="!info.money" @click="pay">
            支付订单
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
  }
  .show {
    height: 200px;
    .nav,
    .info {
      width: 100%;
      height: 100px;
      display: flex;
      justify-content: space-between;
      background-color: rgb(167, 167, 167);
      .nav-item,
      .info-item {
        width: 15%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    }
    .nav {
      .nav-item {
        color: white;
        font-size: 22px;
      }
    }
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
      }
      .name {
        font-size: 25px;
        font-weight: 600;
        color: red;
      }
    }
  }
}
</style>
