<script setup>
// import { movieGetCarouselsService } from '@/api/movie'
import { orderSetService } from '@/api/order'
import { sessionGetOneService } from '@/api/session'
import { formatTime } from '@/utils/data'
// import { useUserStore } from '@/stores'
import { ref, provide, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const session = ref('')
session.value = route.params.session_id
// // 以下为场次基本信息，不需要做修改
const row = ref('')
const col = ref('')
const name = ref('')
const eng_name = ref('')
const theater = ref('')
const movie_id = ref('')
const hall = ref('')
const time = ref('')
const img = ref('')
const duration = ref(0)
const price = ref('')
const seatArr = ref([])
// 获取信息
const getSessionInfo = async () => {
  const res = await sessionGetOneService(session.value)
  console.log(res.data.data)
  if (res.status === 200) {
    // 内部数据
    const data = res.data.data
    const movie = data.Movie
    // 外部数据
    row.value = data.Hall.SeatRow
    col.value = data.Hall.SeatColumn
    price.value = data.Price
    hall.value = data.Hall.Name
    name.value = movie.chinese_name
    eng_name.value = movie.english_name
    duration.value = movie.duration / 60000000000
    theater.value = data.Theater.Name
    movie_id.value = movie.ID
    time.value = formatTime(data.ShowTime)
    img.value = movie.img_path
    console.log(stringToArray(data.SeatStatus, row.value, col.value))
    seatArr.value = stringToArray(data.SeatStatus, row.value, col.value)
  } else {
    ElMessage.error('场次信息获取失败')
  }
}
getSessionInfo()
function stringToArray(str, a, b) {
  const nums = str.split(',').map(Number)
  const array = Array.from({ length: a }, () => Array(b).fill(0))
  let index = 0
  for (let i = 0; i < a; i++) {
    for (let j = 0; j < b; j++) {
      if (index < nums.length) {
        array[i][j] = nums[index++]
      }
    }
  }

  return array
}
const style = computed(() => {
  if (row.value * 43 < 600) {
    return 'display: flex;justify-content: center;'
  } else {
    return ''
  }
})
// 座位数组
// const seatArr = ref([
//   [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1],
//   [2, 1, 2, 1, 2, 1, 0, 1, 1, 2, 1, 1, 0, 1, 0, 0, 1],
//   [1, 2, 1, 2, 1, 1, 0, 1, 1, 1, 2, 1, 0, 1, 0, 0, 1],
//   [1, 2, 1, 2, 0, 1, 2, 1, 1, 1, 2, 1, 0, 1, 0, 0, 1],
//   [1, 2, 1, 2, 0, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 0, 1],
//   [1, 2, 1, 2, 0, 1, 3, 3, 1, 1, 2, 1, 1, 1, 1, 0, 1],
//   [1, 2, 1, 2, 0, 1, 2, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1],
//   [1, 2, 1, 2, 0, 1, 2, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1],
//   [1, 2, 1, 2, 0, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
//   [1, 2, 1, 2, 0, 1, 2, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1],
//   [1, 2, 1, 2, 1, 0, 1, 1, 1, 2, 2, 1, 0, 1, 1, 0, 1]
// ])
// const seatArr = ref([
//   [0, 1, 0, 1, 0, 1, 0, 1, 0],
//   [2, 1, 2, 1, 2, 1, 0, 1, 1],
//   [1, 2, 1, 2, 1, 1, 0, 1, 1],
//   [1, 2, 1, 2, 0, 1, 2, 1, 1],
//   [1, 2, 1, 2, 0, 1, 2, 1, 1],
//   [1, 2, 1, 2, 0, 1, 3, 3, 1],
//   [1, 2, 1, 2, 0, 1, 3, 3, 1],
//   [1, 2, 1, 2, 0, 1, 3, 3, 1],
//   [1, 2, 1, 2, 0, 1, 2, 1, 1]
// ])
// 生成选中的座位的二维数组的函数
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
const checkedSeat = computed(() => {
  return getCheckedSeat(seatArr.value)
})
// 总价
const total = computed(() => {
  return checkedSeat.value.length * price.value
})
provide('changeStatus', (obj) => {
  if (obj.status == 3) {
    if (checkedSeat.value.length < 5) {
      seatArr.value[obj.row - 1][obj.col - 1] = obj.status
    } else {
      ElMessage.warning('最多选5个座位')
    }
  } else {
    seatArr.value[obj.row - 1][obj.col - 1] = obj.status
  }
})
// 根据数组checkedSeat生成选中的座位的字符串checkedSeatArr
// 转换的函数
const getCheckedSeatStr = () => {
  let arr = checkedSeat.value
  let flattenedArray = arr.flat()
  return flattenedArray.join(',')
}
// 购票
const buy = async () => {
  console.log(
    Number(session.value),
    getCheckedSeatStr(),
    movie_id.value,
    checkedSeat.value.length
  )
  const res = await orderSetService(
    Number(session.value),
    getCheckedSeatStr(),
    movie_id.value,
    checkedSeat.value.length
  )
  if (res.status === 200) {
    // 获取到订单id，并跳转页面
    ElMessage.success('订单创建成功')
    router.push({
      path: '/orderShow',
      query: {
        orderId: res.data.data.id
      }
    })
  } else {
    ElMessage.error('订单创建失败')
  }
}
</script>

<template>
  <div class="order">
    <div class="seatArea" :style="style">
      <div class="yinmu">银幕中心</div>
      <seat-table
        v-if="row !== ''"
        :row="row"
        :col="col"
        :seatDefault="seatArr"
      ></seat-table>
    </div>
    <div class="info">
      <div class="info1">
        <img :src="img" alt="" />
        <div class="info3">
          <h5>{{ name }}</h5>
          <h5>{{ eng_name }}</h5>
          <h6>时长：{{ duration }}分钟</h6>
        </div>
      </div>
      <div class="info2">
        <h6>影院：{{ theater }}</h6>
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
