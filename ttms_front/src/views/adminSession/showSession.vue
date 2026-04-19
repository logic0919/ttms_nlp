<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { movieGetHotService } from '@/api/movie'
import { sessionGetListService, sessionDelService } from '@/api/session'
import { getDate, formatDate, formatTime1 } from '@/utils/data'

const router = useRouter()
const theater_id = ref('')
const movie_list = ref([])
const dateData = getDate()
const radio1 = ref(0)
const radio2 = ref(dateData[0].dateid)

watch(
  () => router.currentRoute.value,
  async () => {
    radio2.value = dateData[0].dateid
    try {
      const res = await movieGetHotService()
      movie_list.value = res.data.data.movies || []
      if (movie_list.value.length !== 0) {
        radio1.value = movie_list.value[0].movie_id
        await loadSessions()
      } else {
        radio1.value = 0
        session_list.value = []
      }
    } catch (e) {
      ElMessage({ message: '影片获取失败', type: 'error' })
      movie_list.value = []
    }
  },
  { immediate: true }
)

const session_list = ref([])

const loadSessions = async () => {
  if (!radio1.value || radio1.value === 0) {
    session_list.value = []
    return
  }
  try {
    const dateStr = formatDate(radio2.value).trim()
    // 修复：正确参数顺序 (theater_id不用, movie_id, date)
    const res = await sessionGetListService(null, radio1.value, dateStr)
    // 修复：后端返回 { sessions, total, ... } 对象，需取 .sessions
    session_list.value = res.data.data.sessions || []
  } catch (e) {
    session_list.value = []
    ElMessage({ message: '场次获取失败', type: 'error' })
  }
}

watch(
  () => ({ movie: radio1.value, date: radio2.value }),
  async () => {
    if (movie_list.value.length !== 0) {
      await loadSessions()
    }
  },
  { deep: true }
)

const total = computed(() => session_list.value.length)
const addSession = () => {
  router.push(`/admin/addSession`)
}
const color = (i) => (i % 2 == 0 ? 'background-color: #e7e7e7;' : 'background-color: #d6d6d6')

const delSession = async (id) => {
  ElMessageBox.confirm('确定删除场次？', '提示')
    .then(async () => {
      try {
        await sessionDelService(id)
        session_list.value = session_list.value.filter((item) => item.session_id != id)
        ElMessage({ message: '场次删除成功', type: 'success' })
      } catch (e) {
        ElMessage({ message: '场次删除失败', type: 'error' })
      }
    })
    .catch(() => {})
}

const gotoInfo = (id) => {
  router.push(`/admin/viewSession/${id}`)
}
</script>

<template>
  <div class="showSession">
    <div class="top">
      <div class="total">已找到{{ total }}场安排</div>
      <div class="add">
        <el-button style="width: 100px; height: 40px" type="primary" @click="addSession"
          >增加场次</el-button
        >
      </div>
    </div>
    <!-- <div v-if="movie_list.length == 0" style="margin-top: 160px">
      <el-empty description="暂无正在上映的影片"></el-empty>
    </div> -->
    <div class="showSession1">
      <div class="chooseBox">
        <div class="movieChoose">
          <div class="text">影片：</div>
          <el-radio-group class="radios" v-model="radio1">
            <!-- 新后端使用 movie_id（原来是 id） -->
            <el-radio
              class="movie-item"
              v-for="i in movie_list"
              :value="i.movie_id"
              :key="i.movie_id"
              size="large"
              border
              >{{ i.chinese_name }}</el-radio
            >
          </el-radio-group>
        </div>
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
      <div class="main1">
        <div v-if="session_list.length == 0">
          <el-empty description="没有找到相应场次信息"></el-empty>
        </div>
        <div class="session_list" v-else>
          <div class="nav">
            <span class="id">场次ID</span>
            <span class="name">影片</span>
            <span class="time">时间</span>
            <span class="hall">影厅</span>
            <span class="price">价格</span>
            <span class="opea">操作</span>
          </div>
          <!-- 新后端字段：session_id / chinese_name / stime / etime / name / price -->
          <!-- （原来是 ID / Movie.chinese_name / ShowTime / EndTime / Hall.Name / Price） -->
          <div
            class="item"
            v-for="(i, index) in session_list"
            :key="i.session_id"
            :style="color(index)"
          >
            <span class="id">{{ i.session_id }}</span>
            <span class="name">{{ i.chinese_name }}</span>
            <span class="time">
              <div class="start">{{ formatTime1(i.stime) }}</div>
              <div class="end">{{ formatTime1(i.etime) }}散场</div>
            </span>
            <span class="hall">{{ i.name }}</span>
            <span class="price">￥{{ i.price }}</span>
            <span class="opea">
              <el-button class="btn" type="primary" @click="gotoInfo(i.session_id)">查看</el-button>
              <el-button class="btn" type="primary" @click="delSession(i.session_id)"
                >删除</el-button
              >
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.showSession {
  padding-top: 30px;
  width: 90%;
  min-width: 700px;
  margin: 0 auto;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    border-bottom: 1px solid rgb(105, 105, 105);
    margin-bottom: 30px;
  }
  .chooseBox {
    border: 1px solid #ccc;
    padding: 16px;
    .movieChoose {
      display: flex;
      padding-bottom: 10px;
      border-bottom: 1px dashed #ccc;
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
    .dateChoose {
      display: flex;
      padding-top: 16px;
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
  .main1 {
    margin-top: 30px;
    .session_list {
      .nav,
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .id {
          width: 16%;
        }
        span {
          width: 20%;
        }
      }
      .nav {
        height: 80px;
        border-bottom: 1px solid rgb(105, 105, 105);
        background-color: rgb(156, 156, 156);
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
        .id {
          width: 16%;
        }
        .btn {
          width: 50px;
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
