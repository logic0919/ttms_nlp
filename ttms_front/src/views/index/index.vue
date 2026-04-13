<script setup>
import { ref, onMounted } from 'vue'
import {
  movieIndexHotService,
  movieIndexBoxService,
  // movieGetCarouselsService,
  movieGetUnreleasedService
} from '@/api/movie'
import { useRouter } from 'vue-router'
const router = useRouter()
// const carouse = ref([
//   {
//     img_path: '../assets/image/lunbo02.png',
//     movie_name: '1'
//   },
//   {
//     img_path: '../assets/image/lunbo03.png',
//     movie_name: '2'
//   },
//   {
//     img_path: '../assets/image/lunbo04.png',
//     movie_name: '3'
//   },
//   {
//     img_path: '../assets/image/lunbo0png',
//     movie_name: '4'
//   }
// ])
const carouse = ref([
  {
    img_path:
      'https://p0.pipi.cn/friday/0ec68bfaefc9a5c72f93e59e1ff17d63.jpg?imageMogr2/thumbnail/2500x2500%3E',
    movie_name: '1'
  },
  {
    img_path:
      'https://p0.pipi.cn/friday/80bee4532e7e175179f50c855cb3c516.jpg?imageMogr2/thumbnail/2500x2500%3E',
    movie_name: '2'
  },
  {
    img_path:
      'https://p0.pipi.cn/friday/bf89fcd4a47df6452f41fb25fbe2d5a1.jpg?imageMogr2/thumbnail/2500x2500%3E',
    movie_name: '3'
  },
  {
    img_path:
      'https://p0.pipi.cn/friday/8b2a6a235c0427cd3f087c93294877af.jpg?imageMogr2/thumbnail/2500x2500%3E',
    movie_name: '4'
  }
])
// const getCarouse = async () => {
//   const res = await movieGetCarouselsService()
//   if (res.data.status === 200) {
//     const data = res.data.data.item
//     if (data === null) {
//       carouse.value = []
//     } else {
//       carouse.value = data
//     }
//   } else {
//     ElMessage.error('获取轮播图失败')
//   }
// }
const hot_list = ref([])
const getHot = async () => {
  const res = await movieIndexHotService()
  if (res.data.status === 200) {
    const data = res.data.data.item
    if (data === null) {
      hot_list.value = []
    } else {
      hot_list.value = data
    }
  } else {
    ElMessage.error('获取热门电影失败')
  }
}
const unreleased_list = ref([])
const getUnreleased = async () => {
  const res = await movieGetUnreleasedService({})
  if (res.data.status === 200) {
    let data = res.data.data.item
    if (data === null) {
      unreleased_list.value = []
    } else {
      if (data.length > 6) {
        data = data.slice(0, 6)
      }
      unreleased_list.value = data
    }
  } else {
    ElMessage.error('获取即将上映电影失败')
  }
}
const box_list = ref([])
const getBox = async () => {
  const res = await movieIndexBoxService()
  if (res.data.status === 200) {
    const data = res.data.data.item
    if (data === null) {
      box_list.value = []
    } else {
      box_list.value = data
    }
  } else {
    ElMessage.error('获取票房榜失败')
  }
}
onMounted(() => {
  // getCarouse()
  getHot()
  getUnreleased()
  getBox()
  // setTimeout(() => {
  //   // console.log('轮播图')
  //   // console.log(carouse.value)
  //   console.log('热映')
  //   console.log(hot_list.value)
  //   console.log('即将上映')
  //   console.log(unreleased_list.value)
  //   console.log('票房榜')
  //   console.log(box_list.value)
  // }, 5000)
})
const color = (index) => {
  if (index == 1) {
    return 'color: red;font-size: 25px;font-style: italic;'
  }
}
const info = ref('票房榜')
const info1 = ref('正在热映')
const info2 = ref('即将上映')
const info3 = ref('hotMovie')
const info4 = ref('unreleased')
const info5 = ref('boxOffice')
const gotoDetail = (id) => {
  router.push({
    path: `/movieDetail/${id}/introduction`
  })
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
        <div class="unreleased">
          <div class="top">
            <div class="text">
              <nav-text :info="info2" :eng="info4"></nav-text>
            </div>
            <a href="/movie">全部></a>
          </div>
          <div class="core">
            <movieBox
              v-for="i in unreleased_list"
              :key="i.id"
              :id="i.id"
              :img="i.img_path"
              :name="i.chinese_name"
              :duration="i.duration"
              :category="i.category"
            ></movieBox>
          </div>
        </div>
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
              :key="i.id"
              :id="i.id"
              :img="i.img_path"
              :name="i.chinese_name"
              :duration="i.duration"
              :category="i.category"
            ></movieBox>
          </div>
        </div>
      </div>
      <div class="office">
        <nav-text :info="info" :eng="info5"></nav-text>
        <div
          class="box"
          @click="gotoDetail(i.id)"
          v-for="(i, index) in box_list"
          :key="i.id"
        >
          <div class="text" :style="color(index + 1)">{{ index + 1 }}</div>
          <img :src="i.img_path" alt="" />
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
      .hot,
      .unreleased {
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
