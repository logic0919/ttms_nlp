<script setup>
import { movieGetInfoService } from '@/api/movie'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const route = useRoute()
const movie_id = Number(route.params.id)
const info1 = '介绍'
// const info2 = '评论'
const info3 = ref('introduction')
// const info4 = ref('comment')
const intro = ref('')
const getInfo = async () => {
  const res = await movieGetInfoService(movie_id)
  if (res.data.status === 200) {
    const data = res.data.data
    intro.value = data.introduction
    console.log(data)
  } else {
    ElMessage.error('影片信息获取失败')
  }
}
getInfo()
</script>
<template>
  <div class="movieDetailIntro">
    <navText :info="info1" :eng="info3"></navText>
    <div class="text">
      {{ intro }}
    </div>
    <!-- <div class="commit">
      <navText :info="info2" :eng="info4"></navText>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.movieDetailIntro {
  // background-color: aquamarine;
  .text {
    height: 160px;
    padding-left: 15px;
    padding-top: 16px;
    letter-spacing: 3px;
    font-size: 15px;
    // background-color: aquamarine;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 6;
    text-overflow: ellipsis;
    &::first-letter {
      color: rgb(216, 127, 243);
      font-size: 40px;
    }
  }
}
</style>
