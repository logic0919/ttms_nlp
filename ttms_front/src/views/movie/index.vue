<script setup>
import { sort } from '../../utils/data'
import { movieGetByTabService } from '../../api/movie'
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const movie_list = ref([])

// 补全长度为5的倍数（保持UI整齐）
watch(
  () => movie_list.value.length,
  (newValue) => {
    const sub = 5 - (newValue % 5)
    let arr = []
    if (sub !== 5) {
      for (let i = 0; i < sub; i++) {
        arr.push({ movie_id: -1, chinese_name: '', category_ids: '', duration: 0, movie_img: '' })
      }
    }
    movie_list.value.push(...arr)
  },
  { immediate: true }
)

const nav_id = ref(0)
const sort_id = ref(0)
const page = ref(1)
const refNav = ref(null)

onMounted(() => {
  if (refNav.value && refNav.value.children[0]) {
    refNav.value.children[0].style.backgroundColor = 'red'
  }
})

const switchNav = (num, e) => {
  nav_id.value = num
  if (refNav.value) {
    Array.from(refNav.value.children).forEach((c) => (c.style.backgroundColor = 'transparent'))
    e.target.style.backgroundColor = 'rgb(246, 65, 65)'
  }
  sort_id.value = 0
  page.value = 1
  if (lastActive.value) {
    lastActive.value.style.color = 'black'
    lastActive.value.style.backgroundColor = 'transparent'
  }
  if (ref1.value && ref1.value.children[0]) {
    lastActive.value = ref1.value.children[0]
    lastActive.value.style.color = 'white'
    lastActive.value.style.backgroundColor = 'red'
  }
}

// 全部影片（包含即将上映）
const getAll = async () => {
  try {
    const res = await movieGetByTabService(sort_id.value)
    if (res.data.success) {
      movie_list.value = res.data.data.movies || []
    } else {
      ElMessage.error('获取影片列表失败')
    }
  } catch (e) {
    ElMessage.error('获取影片列表失败')
  }
}

const ref1 = ref(null)
const lastActive = ref(null)

onMounted(() => {
  setTimeout(() => {
    if (ref1.value && ref1.value.children[0]) {
      lastActive.value = ref1.value.children[0]
      lastActive.value.style.backgroundColor = 'red'
      lastActive.value.style.color = 'white'
    }
  }, 10)
})

const switchSort = (e, num) => {
  if (lastActive.value) {
    lastActive.value.style.backgroundColor = 'transparent'
    lastActive.value.style.color = 'black'
  }
  e.target.style.backgroundColor = 'red'
  e.target.style.color = 'white'
  lastActive.value = e.target
  sort_id.value = num
}

watch(
  () => ({ nav: nav_id.value, sort: sort_id.value, page: page.value }),
  () => {
    getAll()
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="movie">
    <div class="top" ref="refNav">
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
            :key="i.movie_id"
            :id="i.movie_id"
            :img="i.movie_img"
            :name="i.chinese_name"
            :duration="i.duration"
            :category="i.category_ids"
          ></movieBox>
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
      cursor: pointer;
    }
  }
  .main {
    width: 1078px;
    margin: 0 auto;
    margin-top: 50px;
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
          cursor: pointer;
        }
      }
    }
    .container {
      .show {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }
    }
  }
}
</style>
