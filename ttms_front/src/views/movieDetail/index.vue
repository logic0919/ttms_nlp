<script setup>
import { Promotion } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { movieGetInfoService } from '@/api/movie'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { sort } from '@/utils/data'

const route = useRoute()
const router = useRouter()
const movie_id = Number(route.params.id)
const introRoute = `/movieDetail/${movie_id}/introduction`
const performerRoute = `/movieDetail/${movie_id}/performer`
const sessionRoute = `/movieSession/${movie_id}`
router.replace(introRoute)

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
      // 后端返回单条电影对象（searchMoviesById → movies[0]）
      const data = res.data.data
      movie.value = data.chinese_name
      eng.value = data.english_name
      // duration 数据库存储为分钟字符串，直接展示
      duration.value = data.duration
      area.value = data.area
      // category_ids 格式为 "0,2,3"，取逗号分隔的分类显示
      type.value = data.category_ids || ''
      img.value = data.movie_img
      // 逗号分隔的数字字符串转为空格分隔的文本字符串
      // 例如 "0,2,3" → "动作 科幻 喜剧"
      strType.value = type.value
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
onMounted(() => {
  getInfo()
})
</script>

<template>
  <div class="movieDetail">
    <div class="top">
      <div class="top-main">
        <img class="img" :src="img" alt="" />
        <div class="info">
          <div class="movieName">{{ movie }}</div>
          <div class="engName">{{ eng }}</div>
          <div class="type">{{ strType }}</div>
          <div class="time">时长：{{ duration }}分钟</div>
          <button class="btn" @click="router.push(sessionRoute)">购票</button>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="menu">
        <el-menu
          active-text-color="rgb(215, 152, 230)"
          text-color="rgb(116, 116, 116)"
          background-color="rgb(255, 255, 255)"
          :default-active="introRoute"
          mode="horizontal"
          ellipsis="false"
          router
          style="border-bottom: 2px solid rgb(240, 240, 240)"
        >
          <el-menu-item :index="introRoute">
            <el-icon><Promotion /></el-icon>
            <span style="font-size: 20px">介绍</span>
          </el-menu-item>
          <el-menu-item :index="performerRoute">
            <el-icon><Promotion /></el-icon>
            <span style="font-size: 20px">演职人员</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="menushow"><router-view></router-view></div>
    </div>
    <tail-box></tail-box>
  </div>
</template>

<style lang="scss" scoped>
.movieDetail {
  min-width: 1000px;
  .top {
    height: 340px;
    background: linear-gradient(to right, rgb(199, 234, 240), rgb(215, 152, 230));
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
          color: rgb(252, 63, 63);
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
    .menu {
      margin-bottom: 40px;
    }
  }
}
</style>
