<script setup>
import { movieGetInfoService } from '@/api/movie'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const route = useRoute()
const movie_id = Number(route.params.id)
const director = ref([])
const actor = ref([])
const getInfo = async () => {
  const res = await movieGetInfoService(movie_id)
  if (res.data.status === 200) {
    const data = res.data.data
    console.log(data.directors)
    console.log(data.actors)
    director.value = data.directors.map((i) => ({
      name: i.Name,
      img: i.ImageURL
    }))
    actor.value = data.actors.map((i) => ({
      name: i.Name,
      img: i.ImageURL
    }))
    console.log(director.value)
    console.log(actor.value)
  } else {
    ElMessage.error('影片信息获取失败')
  }
}
getInfo()
const info1 = '导演'
const info2 = '演员'
const info3 = 'director'
const info4 = 'actor'
</script>
<template>
  <div class="movieDetailPicture">
    <navText :info="info1" :eng="info3"></navText>
    <div class="a">
      <div class="img" v-for="i in director" :key="i.name">
        <img :src="i.img" alt="" />
        <div class="name">{{ i.name }}</div>
      </div>
    </div>
    <navText :info="info2" :eng="info4"></navText>
    <div class="a">
      <div class="img" v-for="i in actor" :key="i.name">
        <img :src="i.img" alt="" />
        <div class="name">{{ i.name }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.movieDetailPicture {
  .a {
    display: flex;
    justify-content: flex-start;
    .img {
      margin-top: 20px;
      margin-bottom: 20px;
      position: relative;
      margin-right: 30px;
      border-radius: 7px;
      overflow: hidden;
      .name {
        position: absolute;
        width: 60px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: white;
        background-color: rgba(154, 154, 154, 0.8);
        top: 0;
        left: 0;
      }
    }
  }
}
</style>
