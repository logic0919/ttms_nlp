<script setup>
import { movieGetInfoService } from '@/api/movie'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const route = useRoute()
const movie_id = Number(route.params.id)

const directorNames = ref([])
const actorNames = ref([])
const directorImg = ref('')
const actorImg = ref('')

const getInfo = async () => {
  try {
    const res = await movieGetInfoService(movie_id)
    if (res.data.success) {
      const data = res.data.data
      directorNames.value = data.directors ? data.directors.split(',').map(s => s.trim()) : []
      actorNames.value = data.actors ? data.actors.split(',').map(s => s.trim()) : []
      directorImg.value = data.director_img || ''
      actorImg.value = data.actor_img || ''
    } else {
      ElMessage.error('影片信息获取失败')
    }
  } catch (e) {
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
      <div class="img" v-for="name in directorNames" :key="name">
        <img :src="directorImg" alt="" />
        <div class="name">{{ name }}</div>
      </div>
    </div>
    <navText :info="info2" :eng="info4"></navText>
    <div class="a">
      <div class="img" v-for="name in actorNames" :key="name">
        <img :src="actorImg" alt="" />
        <div class="name">{{ name }}</div>
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
      img {
        width: 80px;
        height: 100px;
        object-fit: cover;
      }
      .name {
        position: absolute;
        width: 80px;
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