<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { movieGetHottheaterService } from '../../api/movie'
import { sessionGetListService, sessionDelService } from '../../api/session'
import { getDate, formatDate, formatTime1 } from '../../utils/data'
const router = useRouter()
const theater_id = ref('')
const movie_list = ref([])
const dateData = getDate()
const radio1 = ref(0)
const radio2 = ref(dateData[0].dateid)
watch(
  () => router.currentRoute.value,
  async (newValue) => {
    // 如果路径参数改掉
    // 首先，修改theater_id值
    // 其次，radio值赋为初始值
    // 获取该影院正在上映的影片列表
    theater_id.value = newValue.params.theater_id
    radio2.value = dateData[0].dateid
    radio1.value = 1
    const res = await movieGetHottheaterService(theater_id.value)
    if (res.data.status === 200) {
      movie_list.value = res.data.data.item
      if (movie_list.value === null) {
        movie_list.value = []
      }
      radio1.value = 1
      // 切换影院但是该影院的上映影片数量为0，不能发请求
      if (movie_list.value.length !== 0) {
        const res1 = await sessionGetListService(
          theater_id.value,
          radio1.value,
          formatDate(radio2.value)
        )
        if (res1.data.status === 200) {
          session_list.value = res1.data.data.item
          if (res1.data.data.item === null) {
            session_list.value = []
          }
        } else {
          ElMessage({ message: '场次获取失败', type: 'error' })
        }
      }
    } else {
      ElMessage({ message: '影片获取失败', type: 'error' })
    }
  },
  { immediate: true }
)
const addSession = () => {
  router.push(`/admin/addSession/${theater_id.value}`)
}
// 要渲染的场次信息列表
const session_list = ref([])
// 监听选项是否发生变化
watch(
  () => {
    return {
      movie: radio1.value,
      date: radio2.value
    }
  },
  async (newValue) => {
    const res = await sessionGetListService(
      theater_id.value,
      newValue.movie,
      formatDate(newValue.date)
    )
    if (res.data.status === 200) {
      session_list.value = res.data.data.item
      if (res.data.data.item === null) {
        session_list.value = []
      }
    } else {
      ElMessage({ message: '场次获取失败', type: 'error' })
    }
  },
  {
    deep: true
  }
)
const total = computed(() => {
  return session_list.value.length
})
const color = (i) => {
  if (i % 2 == 0) {
    return 'background-color: #e7e7e7;'
  } else {
    return 'background-color: #d6d6d6'
  }
}
// 删除场次
const delSession = async (id) => {
  ElMessageBox.confirm('确定删除场次？', '提示')
    .then(async () => {
      const res = await sessionDelService(Number(id))
      if (res.data.status === 200) {
        ElMessage({ message: '场次删除成功', type: 'success' })
        session_list.value = session_list.value.filter((item) => {
          return item.ID != id
        })
      } else {
        ElMessage({ message: '场次删除失败', type: 'error' })
      }
    })
    .catch(() => {})
}
// 跳转至信息展示页面
const gotoInfo = (id) => {
  router.push(`/admin/viewSession/${theater_id.value}/${id}`)
}
</script>

<template>
  <div class="showSession">
    <div class="top">
      <div class="total">已找到{{ total }}场安排</div>
      <div class="add">
        <el-button
          style="width: 100px; height: 40px"
          type="primary"
          @click="addSession"
          >增加场次</el-button
        >
      </div>
    </div>
    <div v-if="movie_list.length == 0" style="margin-top: 160px">
      <el-empty description="该影院没有上映影片"></el-empty>
    </div>
    <div class="showSession1" v-else>
      <div class="chooseBox">
        <div class="movieChoose">
          <div class="text">影片：</div>
          <el-radio-group class="radios" v-model="radio1">
            <el-radio
              class="movie-item"
              v-for="i in movie_list"
              :value="i.id"
              :key="i.id"
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
            <span class="time">时间 </span>
            <span class="hall">影厅</span>
            <span class="price">价格</span>
            <span class="opea">操作 </span>
          </div>
          <div
            class="item"
            v-for="(i, index) in session_list"
            :key="i.ID"
            :style="color(index)"
          >
            <span class="id">{{ i.ID }}</span>
            <span class="name">{{ i.Movie.chinese_name }}</span>
            <span class="time">
              <div class="start">{{ formatTime1(i.ShowTime) }}</div>
              <div class="end">{{ formatTime1(i.EndTime) }}散场</div>
            </span>
            <span class="hall">{{ i.Hall.Name }}</span>
            <span class="price">￥{{ i.Price }}</span>
            <span class="opea">
              <el-button class="btn" type="primary" @click="gotoInfo(i.ID)"
                >查看</el-button
              >
              <el-button class="btn" type="primary" @click="delSession(i.ID)"
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
    .total {
    }
    .add {
    }
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
