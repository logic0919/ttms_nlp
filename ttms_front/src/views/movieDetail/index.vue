<script setup>
import { Promotion } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { movieGetInfoService } from '@/api/movie'
import { ElMessage } from 'element-plus'
import { sortToStr } from '@/utils/data'
import { ref } from 'vue'
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
const type = ref([])
const area = ref('')
const img = ref('')
const getInfo = async () => {
  const res = await movieGetInfoService(movie_id)
  if (res.data.status === 200) {
    const data = res.data.data
    console.log(data)
    movie.value = data.chinese_name
    eng.value = data.english_name
    duration.value = data.duration / 60000000000
    area.value = data.area
    type.value = sortToStr(data.category_id)
    img.value = data.img_path
  } else {
    ElMessage.error('影片信息获取失败')
  }
}
getInfo()
</script>
<template>
  <div class="movieDetail">
    <div class="top">
      <div class="top-main">
        <img class="img" :src="img" alt="" />
        <div class="info">
          <div class="movieName">{{ movie }}</div>
          <div class="engName">{{ eng }}</div>
          <div class="type">{{ type }}</div>
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
            <el-icon>
              <Promotion />
            </el-icon>
            <span style="font-size: 20px">介绍</span>
          </el-menu-item>
          <el-menu-item :index="performerRoute">
            <el-icon>
              <Promotion />
            </el-icon>
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
    background-color: rgb(116, 116, 116);
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
        // background-color: antiquewhite;
        .movieName,
        .type,
        .time,
        .engName {
          color: aliceblue;
          font-size: 16px;
          // height: 30px;
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
        .btnGro {
          width: 100%;
          height: 46px;
          display: flex;
          justify-content: space-between;
          .btn1 {
            width: 45%;
            border-color: transparent;
            color: rgb(255, 255, 255);
            background-color: rgb(92, 176, 233);
            font-size: 15px;
          }
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
