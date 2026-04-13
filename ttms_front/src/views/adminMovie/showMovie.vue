<script setup>
import { onMounted, ref } from 'vue'
import {
  movieGetAllService,
  movieDelService,
  movieSearchService
} from '@/api/movie'
import { formatDate } from '@/utils/data'
// import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
// const router = useRouter()
const movie_list = ref([])
const seaInp = ref('')
onMounted(async () => {
  const res = await movieGetAllService(1)
  if (res.data.status === 200) {
    movie_list.value = res.data.data.item
  } else {
    movie_list.value = []
    ElMessage({ message: '影片列表获取失败', type: 'error' })
  }
})
const bkgc = (index) => {
  return index % 2 === 0
    ? 'background-color: #f5f5f5'
    : 'background-color: rgb(223, 223, 223)'
}
const del = (id) => {
  console.log(id)
  ElMessageBox.confirm('确定删除这个影片吗？', '提示')
    .then(async () => {
      const res = await movieDelService(id + '')
      if (res.data.status === 200) {
        for (let i = 0; i < movie_list.value.length; i++) {
          if (movie_list.value[i].id === id) {
            movie_list.value.splice(i, 1)
            break
          }
        }
        ElMessage({ message: '删除成功', type: 'success' })
      } else {
        ElMessage({ message: '删除失败，请稍后重试', type: 'error' })
      }
    })
    .catch(() => {})
}
const search = async () => {
  const res = await movieSearchService(seaInp.value)
  if (res.data.status === 200) {
    const data = res.data.data.item
    if (data === null) {
      movie_list.value = []
    } else {
      movie_list.value = data
    }
  } else {
    movie_list.value = []
  }
}
</script>

<template>
  <div class="showMovie">
    <div class="search">
      <el-input
        v-model="seaInp"
        placeholder="请输入搜索内容"
        class="input-with-select"
      >
        <template #append>
          <el-button :icon="Search" @click="search" />
        </template>
      </el-input>
    </div>
    <div v-if="movie_list.length === 0">
      <el-empty description="没有找到符合的影片信息"></el-empty>
    </div>
    <div class="nav" v-else>
      <div class="id">ID</div>
      <div class="name">影片名</div>
      <div class="eng">英文名称</div>
      <div class="show_time">上映时间</div>
      <div class="status">影片状态</div>
      <div class="director">导演</div>
      <div class="intro">剧情介绍</div>
      <div class="img">封面照</div>
      <div class="opea">操作</div>
    </div>
    <div class="table">
      <div
        class="item"
        v-for="(i, index) in movie_list"
        :key="i.id"
        :style="bkgc(index)"
      >
        <div class="id">{{ i.id }}</div>
        <div class="name">{{ i.chinese_name }}</div>
        <div class="eng">{{ i.english_name }}</div>
        <div class="show_time">{{ formatDate(i.showtime) }}</div>
        <div class="status">{{ i.on_sale ? '在上映' : '未上映' }}</div>
        <div class="director">{{ i.directors }}</div>
        <div class="intro">{{ i.introduction }}</div>
        <div class="img"><img :src="i.img_path" alt="" /></div>
        <div class="opea">
          <!-- <el-button plain class="btn" type="primary" @click="change(i.id)">修改</el-button> -->
          <el-button
            plain
            class="btn"
            type="primary"
            @click="del(i.id)"
            :disabled="i.on_sale"
            >删除</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.showMovie {
  width: 90%;
  min-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .search {
    .input-with-select {
      margin-top: 20px;
      margin-bottom: 20px;
      width: 500px;
      height: 50px;
    }
  }
  .table {
    display: flex;
    flex-direction: column;
  }
  .nav {
    height: 90px;
    background-color: rgb(224, 239, 252);
  }
  .table {
    height: 150px;
  }
  .nav,
  .table .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgb(223, 223, 223);
    border: 1px dashed rgb(212, 212, 212);
    div {
      text-align: center;
    }
    .id {
      width: 3%;
    }
    .name {
      width: 10%;
    }
    .eng {
      width: 12%;
      font-size: 10px;
    }
    .show_time {
      width: 6%;
      font-size: 10px;
    }
    .status {
      width: 4%;
      font-size: 10px;
    }
    .director {
      width: 6%;
    }
    .intro {
      padding: 15px;
      font-size: 12px;
      color: rgb(121, 121, 121);
      width: 25%;
    }
    .img {
      width: 17%;
      height: 300px;
      overflow: hidden;
      line-height: 300px;
      img {
        margin-top: 20px;
        height: 80%;
        border: 3px solid rgb(204, 204, 204);
      }
    }
    .opea {
      width: 8%;
      height: 40%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      .btn {
        width: 60px;
        &:nth-child(2) {
          margin-left: -0px;
        }
      }
    }
  }
  .nav {
    div {
      font-size: 16px !important;
      color: black !important;
    }
  }
}
</style>
