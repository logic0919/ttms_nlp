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
// 后端 duration 直接是分钟数
const time = props.duration
</script>

<template>
  <div class="movieBox1" v-if="id < 0"></div>
  <div class="movieBox" @click="router.push(`/movieDetail/${props.id}/introduction`)" v-else>
    <div class="img">
      <img :src="img" alt="" />
      <div class="info">
        <div class="duration">{{ time }}分钟</div>
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
    overflow: hidden; // 配合圆角和防止溢出

    img {
      width: 100%;      // 强制宽度占满
      height: 100%;     // 强制高度占满
      object-fit: cover; // 关键：保持比例切割，不再变形
      border-radius: 5px;
      transition: all 0.5s; // 建议放在这里，而不是放在 hover 里，这样收回时也有动画

      &:hover {
        box-shadow: 0px 4px 10px 4px rgb(130, 130, 130);
        transform: scale(1.02); // 可选：hover时微调大小更有动态感
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

