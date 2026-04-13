<script setup>
import { inject } from 'vue'
// 购票时的座位状态：
// 0：过道
// 1：未售（可选）->3
// 2：已售（不可选）
// 3：当前选中的->1
const props = defineProps({
  row: Number,
  col: Number,
  status: Number
})
const changeStatus = inject('changeStatus')
const change = () => {
  changeStatus({ row: props.row, col: props.col, status: 4 - props.status })
}
</script>

<template>
  <div class="seatImg">
    <img v-if="status === 0" src="../assets/image/road.png" alt="" />
    <img
      v-else-if="status === 1"
      src="../assets/image/available.png"
      @click="change()"
      alt=""
    />
    <img v-else-if="status === 2" src="../assets/image/ban.png" alt="" />
    <img
      v-else-if="status === 3"
      src="../assets/image/checked.png"
      @click="change()"
      alt=""
    />
  </div>
</template>

<style lang="scss" scoped>
.seatImg {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
