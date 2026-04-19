<script setup>
import { useRoute, useRouter } from 'vue-router'
import { sort, getDate, formatDate, formatTime1 } from '@/utils/data'
import { sessionGetListService } from '@/api/session'
import { movieGetInfoService } from '@/api/movie'
import { ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()
const movie_id = Number(route.params.id)
const detailRoute = `/movieDetail/${movie_id}/introduction`
const gotodetail = () => router.push(detailRoute)

const movie = ref('')
const eng = ref('')
const duration = ref('')
const type = ref('')
const area = ref('')
const img = ref('')
const strType = ref('')

const getInfo = async () => {
  try {
    const res = await movieGetInfoService(movie_id)
    if (res.data.success) {
      const data = res.data.data
      movie.value = data.chinese_name
      eng.value = data.english_name
      duration.value = data.duration
      area.value = data.area
      type.value = data.category_ids || ''
      img.value = data.movie_img
      strType.value = type.value
        .slice(2) // 去除前两个字符
        .split(',')
        .map((id) => {
          const index = Number(id)
          return sort[index] || ''
        })
        .filter((name) => name)
        .join(' ')
    } else {
      ElMessage.error('影片信息获取失败')
    }
  } catch (e) {
    ElMessage.error('影片信息获取失败')
  }
}
getInfo()

const session_list = ref([])
// 今明后三个日期
const dateData = getDate()

const radio2 = ref(dateData[0].dateid)

watch(
  () => radio2.value,
  async (dateVal) => {
    try {
      // 后端接口: GET /api/session/seabymovieanddate?movie_id=&date=YYYY-MM-DD
      // 返回: { success, data: { sessions, total, date, movie_id, status } }
      const res = await sessionGetListService(
        null,
        movie_id,
        formatDate(dateVal)
      )
      if (res.data.success) {
        // 后端返回 sessions 数组，每条含 session_id, movie_id, hall_id, stime, etime, price
        // 以及JOIN后的 chinese_name（来自movie表）, name（来自hall表）
        session_list.value = res.data.data.sessions || []
      } else {
        ElMessage({ message: '场次信息获取失败', type: 'error' })
      }
    } catch (e) {
      ElMessage({ message: '场次信息获取失败', type: 'error' })
    }
  },
  { immediate: true }
)

const color = (i) => {
  return i % 2 == 0 ? 'background-color: #e7e7e7;' : 'background-color: #d6d6d6'
}
</script>

<template>
  <div class="movieSession">
    <div class="top">
      <div class="top-main">
        <img class="img" :src="img" alt="" />
        <div class="info">
          <div class="movieName">{{ movie }}</div>
          <div class="engName">{{ eng }}</div>
          <div class="type">{{ strType }}</div>
          <div class="time">时长：{{ duration }}分钟</div>
          <button class="btn" @click="gotodetail()">查看详细信息</button>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="chooseBox">
        <div class="dateChoose">
          <div class="text">日期：</div>
          <el-radio-group class="radios" v-model="radio2">
            <el-radio
              class="movie-item"
              v-for="i in dateData"
              :value="i.dateid"
              :key="i.dateid"
              size="large"
              border
              >{{ i.str }}</el-radio
            >
          </el-radio-group>
        </div>
      </div>
      <div v-if="session_list.length == 0">
        <el-empty description="没有找到相应场次"></el-empty>
      </div>
      <div class="session_list" v-else>
        <div class="nav">
          <span class="name">影片</span>
          <span class="time">时间</span>
          <span class="hall">影厅</span>
          <span class="price">价格</span>
          <span class="opea">操作</span>
        </div>
        <div
          class="item"
          v-for="(i, index) in session_list"
          :key="i.session_id"
          :style="color(index)"
        >
          <!-- findByMovieAndDate JOIN了movie和hall，字段平铺：chinese_name来自movie，name来自hall -->
          <span class="name">{{ i.chinese_name || movie }}</span>
          <span class="time">
            <div class="start">{{ formatTime1(i.stime) }}</div>
            <div class="end">{{ formatTime1(i.etime) }}散场</div>
          </span>
          <span class="hall">{{ i.name }}</span>
          <span class="price">￥{{ i.price }}</span>
          <span class="opea">
            <el-button
              class="btn"
              type="primary"
              @click="router.push(`/order/${i.session_id}`)"
              >选座购票</el-button
            >
          </span>
        </div>
      </div>
    </div>
    <tail-box></tail-box>
  </div>
</template>

<style lang="scss" scoped>
.movieSession {
  min-width: 1000px;
  .top {
    height: 340px;
    background: linear-gradient(
      to right,
      rgb(199, 234, 240),
      rgb(215, 152, 230)
    );
    padding-top: 60px;
    .top-main {
      width: 75%;
      margin: 0 auto;
      height: 400px;
      display: flex;
      justify-content: flex-start;
      .img {
        width: 240px;
        height: 330px;
        border: 6px solid rgb(255, 255, 255);
        margin-right: 100px;
      }
      .info {
        width: 280px;
        height: 260px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .movieName,
        .type,
        .time,
        .engName {
          color: aliceblue;
          font-size: 16px;
        }
        .time {
          margin-bottom: 60px;
        }
        .movieName {
          font-size: 30px;
        }
        .btn {
          width: 100%;
          height: 46px;
          border-color: transparent;
          background-color: red;
          color: rgb(255, 255, 255);
          font-size: 20px;
          letter-spacing: 10px;
        }
      }
    }
  }
  .main {
    width: 70%;
    margin: 100px auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .chooseBox {
      border: 1px solid #ccc;
      padding: 16px;
      .dateChoose {
        display: flex;
        padding-top: 8px;
        .text {
          width: 70px;
        }
        .radios {
          .movie-item {
            margin-right: 10px;
            margin-bottom: 10px;
          }
        }
      }
    }
    .session_list {
      margin-top: 40px;
      .nav,
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          width: 20%;
        }
      }
      .nav {
        height: 80px;
        border-bottom: 1px solid rgb(105, 105, 105);
        background-color: rgb(171, 171, 171);
        span {
          font-size: 22px;
          color: rgb(255, 255, 255);
          text-align: center;
        }
      }
      .item {
        height: 70px;
        span {
          text-align: center;
        }
        .btn {
          width: 100px;
          border-radius: 30px;
          background-color: rgb(237, 31, 31);
          border-color: transparent;
          box-shadow: 1px 1px 4px 2px rgb(232, 162, 162);
        }
        .price {
          font-weight: 700;
          color: red;
        }
        .name {
          font-size: 18px;
          font-weight: 900;
          color: #6d6d6d;
        }
        .time {
          .start {
            font-size: 16px;
            font-weight: 700;
          }
          .end {
            font-size: 10px;
            color: #848484;
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>
