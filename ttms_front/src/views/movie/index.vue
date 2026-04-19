<script setup>
import { sort } from '../../utils/data'
import { movieGetByTabService, movieSearchService } from '../../api/movie'
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const movie_list = ref([])
const searchKeyword = ref('')
const isSearching = ref(false)
const isAllActive = ref(true) // 默认"所有影片"处于选中状态

watch(
  () => movie_list.value.length,
  (newValue) => {
    const sub = 5 - (newValue % 5)
    let arr = []
    if (sub !== 5) {
      for (let i = 0; i < sub; i++) {
        arr.push({
          movie_id: -1,
          chinese_name: '',
          category_ids: '',
          duration: 0,
          movie_img: ''
        })
      }
    }
    movie_list.value.push(...arr)
  },
  { immediate: true }
)

const sort_id = ref(0)
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

const switchSort = (e, num) => {
  if (lastActive.value) {
    lastActive.value.style.backgroundColor = 'transparent'
    lastActive.value.style.color = 'black'
  }
  e.target.style.backgroundColor = 'red'
  e.target.style.color = 'white'
  lastActive.value = e.target
  sort_id.value = num
  searchKeyword.value = ''
  isSearching.value = false
  isAllActive.value = false // 切换分类时取消"所有影片"高亮
}

const resetAll = () => {
  searchKeyword.value = ''
  isSearching.value = false
  sort_id.value = 0
  isAllActive.value = true // 点击"所有影片"时高亮
  if (ref1.value && ref1.value.children[0]) {
    if (lastActive.value) {
      lastActive.value.style.backgroundColor = 'transparent'
      lastActive.value.style.color = 'black'
    }
    lastActive.value = ref1.value.children[0]
    lastActive.value.style.backgroundColor = 'red'
    lastActive.value.style.color = 'white'
  }
  getAll()
}

const doSearch = async () => {
  const kw = searchKeyword.value.trim()
  if (!kw) {
    isSearching.value = false
    getAll()
    return
  }
  isSearching.value = true
  isAllActive.value = false // 搜索时取消"所有影片"高亮
  try {
    const res = await movieSearchService(kw)
    if (res.data.success) {
      movie_list.value = res.data.data.movies || []
    } else {
      ElMessage.error('搜索失败')
    }
  } catch (e) {
    ElMessage.error('搜索失败')
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
  isSearching.value = false
  isAllActive.value = true
  getAll()
}

watch(
  () => sort_id.value,
  () => {
    if (!isSearching.value) getAll()
  },
  { immediate: true }
)
</script>

<template>
  <div class="movie">
    <div class="top">
      <div class="all" :class="{ active: isAllActive }" @click="resetAll">
        所有影片
      </div>
    </div>
    <div class="main">
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索影片名称"
          clearable
          @clear="clearSearch"
          @keyup.enter="doSearch"
          style="width: 300px"
        >
          <template #append>
            <el-button @click="doSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
      <div class="nav" v-if="!isSearching">
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
    .all {
      width: 130px;
      height: 100%;
      color: rgb(255, 255, 255);
      line-height: 70px;
      letter-spacing: 2px;
      text-align: center;
      cursor: pointer;
      transition: background-color 0.2s;
      &.active {
        background-color: rgb(246, 65, 65);
      }
      &:hover {
        background-color: rgba(246, 65, 65, 0.7);
      }
    }
  }
  .main {
    width: 1078px;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .search-bar {
      margin-bottom: 20px;
    }
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
