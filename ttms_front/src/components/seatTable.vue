<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  row: Number,
  col: Number,
  seatDefault: Array
})

const seat = ref([])

// 核心修复：监听 seatDefault，数据就绪后再赋值，deep 确保数组内容变化也能触发
watch(
  () => props.seatDefault,
  (val) => {
    if (val && val.length > 0) {
      seat.value = val
    }
  },
  { immediate: true, deep: true }
)

const width = computed(() => props.col * 50 + 'px')

const style = computed(() => {
  return `width: ${width.value}; height: 600px;`
})
</script>

<template>
  <div v-if="seat && seat.length > 0" class="seatTable" :style="style">
    <div class="row" v-for="(i, index) in seat" :key="index">
      <h4>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</h4>
      <div class="seats">
        <seat-img
          v-for="(j, index1) in i"
          :row="index + 1"
          :col="index1 + 1"
          :status="j"
          :key="index1"
        ></seat-img>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.seatTable {
  padding-left: 40px;
  padding-right: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    h4 {
      width: 10%;
      text-align: center;
      margin-right: 20px;
    }
    .seats {
      display: flex;
      justify-content: flex-start;
      flex-wrap: nowrap;
    }
  }
}
</style>
