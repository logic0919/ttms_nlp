<script setup>
import { sort } from '../../utils/data'
import {
  movieGetHotService,
  movieGetUnreleasedService,
  movieGetAllService
} from '../../api/movie'
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { findSortIndex } from '../../utils/data'
const movie_list = ref([])
onMounted(() => {
  refNav.value.children[0].style.backgroundColor = 'red'
})
// 页数统计
const totalPage = ref(0)
// 对数组长度进行修正
watch(
  () => movie_list.value.length,
  (newValue) => {
    const sub = 5 - (newValue % 5)
    let arr = []
    if (sub !== 5) {
      for (let i = 0; i < sub; i++) {
        arr.push({
          id: -1,
          chinese_name: '',
          category: '',
          duration: 0,
          img_path: ''
        })
      }
    }
    movie_list.value.push(...arr)
    // totalPage.value = Math.ceil(movie_list.value.length / 30)
    // console.log(totalPage.value)
  },
  { immediate: true }
)
// 区分热映或是即将热映或是全部影片，默认正在热映hot
const nav_id = ref(0)
const sort_id = ref(0)
const page = ref(1)
const refNav = ref(null)
// 切换导航
const switchNav = (num, e) => {
  nav_id.value = num
  refNav.value.children[0].style.backgroundColor = 'transparent'
  refNav.value.children[1].style.backgroundColor = 'transparent'
  refNav.value.children[2].style.backgroundColor = 'transparent'
  e.target.style.backgroundColor = 'rgb(246, 65, 65)'
  //   sort和page都要归零
  sort_id.value = 0
  page.value = 0
  lastActive.value.style.color = 'black'
  lastActive.value.style.backgroundColor = 'transparent'
  lastActive.value = ref1.value.children[0]
  lastActive.value.style.color = 'white'
  lastActive.value.style.backgroundColor = 'red'
}
// 发送全部类型、第一页的函数
const getHot = async () => {
  const res = await movieGetHotService({
    page: page.value,
    id: findSortIndex(sort[sort_id.value])
  })
  if (res.data.status === 200) {
    if (res.data.data.item === null) {
      movie_list.value = []
    } else {
      movie_list.value = res.data.data.item
    }
  } else {
    ElMessage.error('获取影片列表失败')
  }
}
const getUnreleased = async () => {
  const res = await movieGetUnreleasedService({
    page: page.value,
    id: findSortIndex(sort[sort_id.value])
  })
  if (res.data.status === 200) {
    if (res.data.data.item === null) {
      movie_list.value = []
    } else {
      movie_list.value = res.data.data.item
    }
  } else {
    ElMessage.error('获取影片列表失败')
  }
}
const getAll = async () => {
  const res = await movieGetAllService({
    page: page.value,
    id: findSortIndex(sort[sort_id.value])
  })
  if (res.data.status === 200) {
    if (res.data.data.item === null) {
      movie_list.value = []
    } else {
      movie_list.value = res.data.data.item
    }
  } else {
    ElMessage.error('获取影片列表失败')
  }
}
// 默认第一个高亮
// 这里的定时器应该切换为钩子函数更合理
const ref1 = ref(null)
const lastActive = ref()
setTimeout(() => {
  lastActive.value = ref1.value.children[0]
  lastActive.value.style.backgroundColor = 'red'
  lastActive.value.style.color = 'white'
}, 10)
// 切换类型
const switchSort = (e, num) => {
  lastActive.value.style.backgroundColor = 'transparent'
  lastActive.value.style.color = 'black'
  e.target.style.backgroundColor = 'red'
  e.target.style.color = 'white'
  lastActive.value = e.target
  sort_id.value = num
}
// 对nav、类型、页码进行监听，一个有变就发请求
watch(
  () => {
    return {
      nav: nav_id.value,
      sort: sort_id.value,
      page: page.value
    }
  },
  (newValue) => {
    if (newValue.nav === 0) {
      console.log('发hot请求')
      console.log(nav_id.value, findSortIndex(sort[sort_id.value]), page.value)
      getHot()
    } else if (newValue.nav === 1) {
      console.log('发unreleased请求')
      console.log(nav_id.value, findSortIndex(sort[sort_id.value]), page.value)
      getUnreleased()
    } else if (newValue.nav === 2) {
      console.log('发all请求')
      console.log(nav_id.value, findSortIndex(sort[sort_id.value]), page.value)
      getAll()
    }
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<template>
  <div class="movie">
    <div class="top" ref="refNav">
      <div class="hot" @click="(e) => switchNav(0, e)">热映</div>
      <div class="will" @click="(e) => switchNav(1, e)">即将上映</div>
      <div class="all" @click="(e) => switchNav(2, e)">所有影片</div>
    </div>
    <div class="main">
      <div class="nav">
        <div class="text">类型：</div>
        <div class="sort" ref="ref1">
          <div
            class="sort-item"
            v-for="(i, index) in sort"
            :key="i"
            @click="(e) => switchSort(e, index)"
          >
            {{ i }}
          </div>
        </div>
      </div>
      <div class="container" v-if="movie_list.length">
        <div class="show">
          <movieBox
            v-for="i in movie_list"
            :key="i.id"
            :id="i.id"
            :img="i.img_path"
            :name="i.chinese_name"
            :duration="i.duration"
            :category="i.category"
          ></movieBox>
        </div>
        <div class="page">
          <el-pagination
            class="pageMain"
            v-model:current-page="page"
            background="red"
            layout="prev, pager, next"
            :total="totalPage"
            @current-change="changePage()"
          />
        </div>
      </div>
      <div class="empty" v-else><empty-com></empty-com></div>
    </div>
    <tail-box></tail-box>
  </div>
</template>

<style lang="scss" scoped>
* {
  list-style: none;
  box-sizing: border-box;
}
.movie {
  min-width: 1100px;
  .top {
    height: 70px;
    background-color: rgb(93, 93, 93);
    display: flex;
    justify-content: center;
    .hot,
    .will,
    .all {
      width: 130px;
      height: 100%;
      color: rgb(255, 255, 255);
      line-height: 70px;
      letter-spacing: 2px;
      text-align: center;
    }
  }
  .main {
    width: 1078px;
    margin: 0 auto;
    margin-top: 50px;
    // background-color: rgb(239, 239, 239);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .nav {
      height: 140px;
      width: 100%;
      border: 1px dashed rgb(102, 102, 102);
      display: flex;
      justify-content: space-between;
      padding: 10px;
      .text {
        text-align: center;
        width: 6%;
      }
      .sort {
        width: 94%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .sort-item {
          margin-right: 10px;
          font-size: 10%;
          text-align: center;
          width: 60px;
          height: 30px;
          border-radius: 15px;
          line-height: 27px;
          border: 1px solid red;
          margin-bottom: 10px;
        }
      }
    }
    .container {
      .show {
        display: flex;
        // background-color: antiquewhite;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      .pageMain {
        margin: 30px auto;
      }
    }
  }
}
</style>
