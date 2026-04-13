<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  row: Number,
  col: Number,
  seatDefault: Array
})
console.log(props)
const seat = ref([])
onMounted(() => {
  if (seat.value == []) {
    seat.value = Array.from({ length: props.row }, () =>
      Array.from({ length: props.col }, () => 1)
    )
  } else {
    seat.value = props.seatDefault
  }
})
const width = props.col * 50 + 'px'
// const height = props.row * 40 + 'px'
const style = computed(() => {
  // return `width: ${props.row * 40}+ 'px';height:${props.col * 80} + 'px';background-color: rgb(240,240,240);`
  return `width: ${width};height:600px;`
})
</script>

<template>
  <div class="seatTable" :style="style">
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
      // border: 1px solid rgb(162, 86, 86);
    }
  }
}
</style>
