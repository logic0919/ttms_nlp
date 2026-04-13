<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  id: Number,
  img: String,
  name: String,
  duration: Number,
  category: String
})
const time = props.duration / 60000000000
</script>

<template>
  <div class="movieBox1" v-if="id < 0"></div>
  <div
    class="movieBox"
    @click="router.push(`/movieDetail/${props.id}/introduction`)"
    v-else
  >
    <div class="img">
      <img :src="img" alt="" />
      <div class="info">
        <div class="duration">{{ time }}分钟</div>
        <div class="cateGory">{{ category }}</div>
      </div>
    </div>
    <div class="text">{{ name }}</div>
  </div>
</template>

<style lang="scss" scoped>
.movieBox1 {
  width: 180px;
  height: 280px;
  margin-top: 30px;
}
.movieBox {
  width: 180px;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  .img {
    width: 100%;
    height: 88%;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
      &:hover {
        transition: all 0.5s;
        box-shadow: 0px 4px 10px 4px rgb(130, 130, 130);
      }
    }
    .info {
      width: 100%;
      height: 20%;
      position: absolute;
      bottom: 0px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      background-color: rgba(221, 221, 221, 0.6);
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      div {
        font-size: 14px;
        color: red;
      }
    }
  }
  .text {
    height: 8%;
  }
}
</style>
