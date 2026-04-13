<script setup>
import { inject } from 'vue'
// 设置演出听时的座位状态
// 0：过道
// 1：座位
const props = defineProps({
  row: Number,
  col: Number,
  status: Number
})
const changeStatus = inject('changeStatus')
const change = () => {
  changeStatus({ row: props.row, col: props.col, status: 1 - props.status })
}
</script>

<template>
  <div class="seatImgAdmin">
    <img
      v-if="status === 0"
      src="../assets/image/road.png"
      @click="change()"
      alt=""
    />
    <img v-else src="../assets/image/available.png" @click="change()" alt="" />
  </div>
</template>

<style lang="scss" scoped>
.seatImgAdmin {
  width: 30px;
  height: 30px;
  margin-left: 10px;
  margin-bottom: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
