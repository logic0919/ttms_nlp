<script setup>
import { orderSetService } from '@/api/order'
import {
  sessionGetOneService,
  sessionGetLockedSeatService
} from '@/api/session'
import { hallGetService } from '@/api/hall'
import { movieGetInfoService } from '@/api/movie'
import { formatTime } from '@/utils/data'
import { ref, provide, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const session_id = ref(route.params.session_id)

const row = ref(0)
const col = ref(0)
const name = ref('')
const eng_name = ref('')
const hall = ref('')
const time = ref('')
const img = ref('')
const duration = ref(0)
const price = ref(0)
const seatArr = ref([])
const seatReady = ref(false)

function buildSeatArr(hallSeatStr, rnum, cnum, lockedSeats) {
  let base
  if (hallSeatStr) {
    const nums = hallSeatStr.split(',').map(Number)
    base = Array.from({ length: rnum }, (_, i) =>
      Array.from({ length: cnum }, (_, j) => nums[i * cnum + j] ?? 1)
    )
  } else {
    base = Array.from({ length: rnum }, () => Array(cnum).fill(1))
  }
  if (lockedSeats && lockedSeats.length) {
    for (const [r, c] of lockedSeats) {
      if (r >= 1 && r <= rnum && c >= 1 && c <= cnum) {
        base[r - 1][c - 1] = 2
      }
    }
  }
  return base
}

const getSessionInfo = async () => {
  try {
    const res = await sessionGetOneService(session_id.value)
    const sessionData = res.data.data
    price.value = sessionData.price
    time.value = formatTime(sessionData.stime)

    const hallRes = await hallGetService(sessionData.hall_id)
    const hallData = hallRes.data.data
    hall.value = hallData.name
    row.value = hallData.rnum
    col.value = hallData.cnum

    const movieRes = await movieGetInfoService(sessionData.movie_id)
    const rawMovieData = movieRes.data.data
    const movieData = Array.isArray(rawMovieData) ? rawMovieData[0] : rawMovieData
    name.value = movieData.chinese_name
    eng_name.value = movieData.english_name
    duration.value = Number(movieData.duration)
    img.value = movieData.movie_img

    const lockedRes = await sessionGetLockedSeatService(session_id.value)
    const lockedSeats = lockedRes.data.data.lockedSeats || []

    seatArr.value = buildSeatArr(
      hallData.seat,
      hallData.rnum,
      hallData.cnum,
      lockedSeats
    )

    seatReady.value = true
  } catch (e) {
    ElMessage.error('场次信息获取失败')
  }
}

onMounted(() => {
  getSessionInfo()
})

const style = computed(() => {
  if (row.value * 43 < 600) {
    return 'display: flex;justify-content: center;'
  }
  return ''
})

const getCheckedSeat = (matrix) => {
  let indices = []
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 3) {
        indices.push([i + 1, j + 1])
      }
    }
  }
  return indices
}

const checkedSeat = computed(() => getCheckedSeat(seatArr.value))
const total = computed(() => checkedSeat.value.length * price.value)

provide('changeStatus', (obj) => {
  if (obj.status === 3) {
    if (checkedSeat.value.length < 5) {
      seatArr.value[obj.row - 1][obj.col - 1] = obj.status
    } else {
      ElMessage.warning('最多选5个座位')
    }
  } else {
    seatArr.value[obj.row - 1][obj.col - 1] = obj.status
  }
})

const buy = async () => {
  if (checkedSeat.value.length === 0) {
    ElMessage.warning('请先选择座位')
    return
  }
  try {
    const res = await orderSetService(
      Number(session_id.value),
      checkedSeat.value
    )
    ElMessage.success('订单创建成功')
    router.push({
      path: '/orderShow',
      query: { orderId: res.data.data.order_id }
    })
  } catch (e) {
    // 错误已由 request 拦截器处理
  }
}
</script>

<template>
  <div class="order">
    <div class="seatArea" :style="style">
      <div class="yinmu">银幕中心</div>
      <seat-table
        v-if="seatReady"
        :row="row"
        :col="col"
        :seatDefault="seatArr"
      ></seat-table>
      <div v-if="!seatReady">正在加载座位信息...</div>
    </div>
    <div class="info">
      <div class="info1">
        <img class="imgaa" :src="img" alt="" />
        <div class="info3">
          <h5>{{ name }}</h5>
          <h5>{{ eng_name }}</h5>
          <h6>时长：{{ duration }}分钟</h6>
        </div>
      </div>
      <div class="info2">
        <h6>影厅：{{ hall }}</h6>
        <h6>开场时间：{{ time }}</h6>
        <h6>票价：{{ price }}</h6>
      </div>
      <div class="checked">
        <div class="seat">
          <h6>座位：</h6>
          <div class="most" v-if="checkedSeat.length === 0">
            最多选择五个座位
          </div>
          <div class="tags" v-else>
            <el-check-tag
              class="tag"
              checked="true"
              type="danger"
              v-for="i in checkedSeat"
              :key="i"
              >{{ i[0] }}行{{ i[1] }}列</el-check-tag
            >
          </div>
        </div>
        <h3 class="totalPrice" v-if="checkedSeat.length !== 0">
          总价：{{ total }}
        </h3>
        <el-button class="btn" @click="buy" :disabled="checkedSeat.length === 0"
          >确认购票</el-button
        >
      </div>
    </div>
  </div>
  <tail-box></tail-box>
</template>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.order {
  width: 1000px;
  display: flex;
  justify-content: space-between;
  border: 1px solid red;
  margin: 0 auto;
  margin-top: 130px;
  .seatArea {
    position: relative;
    overflow-x: auto;
    width: 650px;
    .yinmu {
      width: 120px;
      height: 40px;
      line-height: 40px;
      position: fixed;
      top: 0;
      left: 50%;
      margin-left: -40px;
      background-color: rgb(124, 124, 124);
      color: white;
      text-align: center;
    }
  }
  .info {
    width: 350px;
    border: 1px solid red;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: rgb(242, 242, 242);
    .info1,
    .info2 {
      border-bottom: 1px dashed red;
    }
    .info1 {
      display: flex;
      justify-content: flex-start;
      padding-bottom: 10px;
      height: 30%;
      img {
        width: 120px;
        height: 170px;
        margin-right: 20px;
        border: 2px solid white;
      }
      .info3 {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }
    .info2 {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 22%;
    }
    .checked {
      height: 45%;
      padding-top: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      .seat {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        h6 {
          width: 40px;
        }
        .most {
          margin-bottom: 20px;
          font-size: 16px;
          color: rgb(145, 145, 145);
        }
        .tags {
          width: 80%;
          .tag {
            width: 60px;
            height: 30px;
            font-size: 10px;
            margin-right: 10px;
            margin-bottom: 10px;
            text-align: center;
            line-height: 30px;
          }
        }
      }
      .totalPrice {
        margin-top: 20px;
        margin-bottom: 20px;
      }
      .btn {
        width: 70%;
        margin: 0 auto;
        height: 40px;
        line-height: 40px;
        border-radius: 20px;
        border-color: transparent;
        background-color: red;
        color: white;
      }
    }
  }
}
</style>
