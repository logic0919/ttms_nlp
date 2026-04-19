<script setup>
import { ref, onMounted } from 'vue'
import { movieGetAllService } from '@/api/movie'
import { useRouter } from 'vue-router'

const router = useRouter()

const carouse = ref([
  {
    img_path:
      'https://p0.pipi.cn/friday/0ec68bfaefc9a5c72f93e59e1ff17d63.jpg?imageMogr2/thumbnail/2500x2500%3E',
    movie_name: '1'
  },
  {
    img_path:
      'https://ttms-img.oss-cn-beijing.aliyuncs.com/assets/29d0abeb-fd56-476e-bc51-a813d0b676d0.png',
    movie_name: '2'
  },
  {
    img_path:
      'https://p0.pipi.cn/friday/bf89fcd4a47df6452f41fb25fbe2d5a1.jpg?imageMogr2/thumbnail/2500x2500%3E',
    movie_name: '3'
  },
  {
    img_path:
      'https://ttms-img.oss-cn-beijing.aliyuncs.com/assets/92d98ae3-7fcb-4e97-be70-74a92b5d1ef4.png',
    movie_name: '4'
  }
])

// 从数组中随机取 n 个，不重复
const randomPick = (arr, n) => {
  const copy = [...arr]
  const result = []
  while (result.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length)
    result.push(copy.splice(idx, 1)[0])
  }
  return result
}

// 正在热映模块：随机取6个
const hot_list = ref([])
// 票房榜模块：随机取6个（和热映取自同一份数据但顺序不同）
const box_list = ref([])

const getAllMovies = async () => {
  try {
    const res = await movieGetAllService()
    if (res.data.success) {
      const all = res.data.data.movies || []
      hot_list.value = randomPick(all, 6)
      box_list.value = randomPick(all, 6)
    } else {
      ElMessage.error('获取电影失败')
    }
  } catch (e) {
    ElMessage.error('获取电影失败')
  }
}

onMounted(() => {
  getAllMovies()
})

const color = (index) => {
  if (index === 1) {
    return 'color: red;font-size: 25px;font-style: italic;'
  }
}

const info = ref('票房榜')
const info1 = ref('正在热映')
const info3 = ref('hotMovie')
const info5 = ref('boxOffice')

const gotoDetail = (id) => {
  router.push({ path: `/movieDetail/${id}/introduction` })
}
</script>

<template>
  <div class="index">
    <div class="carousels">
      <el-carousel indicator-position="outside" height="470px">
        <el-carousel-item
          v-for="(item, index) in carouse"
          style="height: 100%"
          :key="index"
        >
          <div class="carousel-item">
            <img
              :src="item.img_path"
              :alt="item.movie_name"
              class="carousel-image"
            />
            <h3 class="movie-name">{{ item.movie_name }}</h3>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="main">
      <div class="movie">
        <div class="hot">
          <div class="top">
            <div class="text">
              <nav-text :info="info1" :eng="info3"></nav-text>
            </div>
            <a href="/movie">全部></a>
          </div>
          <div class="core">
            <movieBox
              v-for="i in hot_list"
              :key="i.movie_id"
              :id="i.movie_id"
              :img="i.movie_img"
              :name="i.chinese_name"
              :duration="i.duration"
              :category="i.category_ids"
            ></movieBox>
          </div>
        </div>
      </div>
      <div class="office">
        <nav-text :info="info" :eng="info5"></nav-text>
        <div
          class="box"
          @click="gotoDetail(i.movie_id)"
          v-for="(i, index) in box_list"
          :key="i.movie_id"
        >
          <div class="text" :style="color(index + 1)">{{ index + 1 }}</div>
          <img :src="i.movie_img" alt="" />
          <div class="main">{{ i.chinese_name }}</div>
        </div>
      </div>
    </div>
  </div>
  <tail-box></tail-box>
</template>

<style lang="scss" scoped>
* {
  text-decoration: none;
}
.index {
  width: 80%;
  min-width: 1000px;
  margin: 120px auto;
  .carousels {
    height: 470px;
    margin-top: 20px;
    margin-bottom: 30px;
    img {
      width: 100%;
      height: 600px;
    }
  }
  .main {
    display: flex;
    justify-content: space-between;
    .movie {
      width: 60%;
      .hot {
        .top {
          height: 70px;
          padding-left: 20px;
          padding-right: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .text {
            font-size: 20px;
          }
          a {
            color: rgb(255, 120, 120);
            font-size: 25px;
            letter-spacing: 5px;
            font-weight: 700;
          }
        }
        .core {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
      }
    }
    .office {
      width: 35%;
      padding-left: 10px;
      .box {
        height: 80px;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 10px;
        box-shadow: 0px 4px 10px 4px rgb(184, 184, 184);
        overflow: hidden;
        cursor: pointer;
        .text {
          width: 40px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(158, 158, 158, 0.6);
        }
        img {
          height: 96%;
        }
        .main {
          width: 60%;
          line-height: 30px;
          color: rgb(226, 109, 109);
          font-size: 20px;
        }
      }
    }
  }
}
</style>
